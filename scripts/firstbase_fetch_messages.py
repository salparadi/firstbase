from pathlib import Path
import requests
import sqlalchemy
import ujson
from typing import List, Dict
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Constants
ADDRESS = os.getenv("NEXT_PUBLIC_DEV_ADDRESS")
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")
BASESCAN_API_KEY = os.getenv("BASESCAN_API_KEY")

ENDPOINTS = {
    "ethereum": {
        "url": "https://api.etherscan.io/api",
        "api_key": ETHERSCAN_API_KEY,
        "chain": "ethereum"
    },
    "base": {
        "url": "https://api.basescan.org/api",
        "api_key": BASESCAN_API_KEY,
        "chain": "base"
    }
}

DATABASE_URL = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
engine = sqlalchemy.create_engine(DATABASE_URL)

# UTF-8 replacements
utf8_replacements = {
    " \u0018": "'",
    " \u0019": "'",
    " \u001c": """,
    " \u001d": """,
    "\u2019": "'",
    " \u0013": "–",
    " \u0014": "—",
}

def get_transactions(endpoint_info: Dict) -> List[Dict]:
    url = (
        f"{endpoint_info['url']}?"
        f"module=account&action=txlist&address={ADDRESS}"
        f"&startblock=0&endblock=99999999&page=1&offset=1000"
        f"&sort=asc&apikey={endpoint_info['api_key']}"
    )
    print(url)
    
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Error fetching from {endpoint_info['chain']}: {response.status_code}")
        return []
        
    api_response = response.json()
    if api_response["status"] != "1":
        print(f"API Error from {endpoint_info['chain']}: {api_response['message']}")
        return []
        
    transactions = []
    for tx in api_response["result"]:
        if ((tx["from"].lower() == ADDRESS.lower()) or (tx["to"].lower() == ADDRESS.lower())) and tx["functionName"] == "":
            transaction_details = {
                "blockNumber": tx["blockNumber"],
                "timeStamp": tx["timeStamp"],
                "hash": tx["hash"],
                "from": tx["from"],
                "to": tx["to"],
                "nonce": tx["nonce"],
                "input": decode_input(tx["input"]),
                "chain": endpoint_info["chain"]
            }
            transactions.append(transaction_details)
    
    return transactions

def decode_input(input_hex: str) -> str:
    decoded = bytes.fromhex(input_hex[2:]).decode("utf-8", errors="ignore")
    for utf8_code, replacement in utf8_replacements.items():
        decoded = decoded.replace(utf8_code, replacement)
    return decoded

def import_data():
    all_transactions = []
    
    # Fetch from both chains
    for chain_name, endpoint_info in ENDPOINTS.items():
        print(f"\nFetching from {chain_name}...")
        transactions = get_transactions(endpoint_info)
        all_transactions.extend(transactions)
        print(f"Found {len(transactions)} transactions on {chain_name}")
    
    # Sort all transactions by timestamp
    all_transactions.sort(key=lambda x: int(x["timeStamp"]))
    
    # Import to database directly
    print("\n• Importing Messages")
    with engine.connect() as connection:
        existing_hashes = {
            row[0]
            for row in connection.execute(
                sqlalchemy.sql.text("SELECT hash FROM messages")
            )
        }
        
        for message in all_transactions:
            if message["hash"] not in existing_hashes and message["input"] != "":
                try:
                    sql = sqlalchemy.sql.text("""
                        INSERT INTO messages 
                        (blockNumber, timeStamp, hash, `from`, `to`, `nonce`, `input`, `status`, `chain`) 
                        VALUES 
                        (:blockNumber, :timeStamp, :hash, :from, :to, :nonce, :input, :status, :chain)
                    """)
                    val = {
                        "blockNumber": message["blockNumber"],
                        "timeStamp": message["timeStamp"],
                        "hash": message["hash"],
                        "from": message["from"],
                        "to": message["to"],
                        "nonce": message["nonce"],
                        "input": message["input"],
                        "status": 1,
                        "chain": message["chain"]
                    }
                    connection.execute(sql, val)
                except Exception as e:
                    print(f"Error inserting message {message['hash']}: {e}")
        
        connection.commit()
    
    print("• Messages imported")

def main():
    print(
        "\n***************************************"
        "\n***       IMPORTING MESSAGES        ***"
        "\n***************************************"
        "\n"
    )
    import_data()

if __name__ == "__main__":
    main()