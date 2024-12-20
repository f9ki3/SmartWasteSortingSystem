import sqlite3
from datetime import datetime

# Define the database file
DATABASE_NAME = "database.db"

# Define the SQL command to create the table
CREATE_TABLE_QUERY = """
CREATE TABLE IF NOT EXISTS recycle_data (
    recycle_type TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
"""

def create_database_and_table():
    """Creates the SQLite database and the recycle_data table."""
    connection = sqlite3.connect(DATABASE_NAME)
    try:
        cursor = connection.cursor()
        cursor.execute(CREATE_TABLE_QUERY)
        print("Table 'recycle_data' created successfully!")
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        connection.close()

def insert_data(recycle_type):
    """Inserts a new record into the recycle_data table."""
    connection = sqlite3.connect(DATABASE_NAME)
    try:
        cursor = connection.cursor()
        # SQL command to insert data
        INSERT_QUERY = "INSERT INTO recycle_data (recycle_type) VALUES (?);"
        cursor.execute(INSERT_QUERY, (recycle_type,))
        connection.commit()
        print(f"Data inserted successfully: {recycle_type}")
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        connection.close()

def get_all_records():
    """Retrieves all records from the recycle_data table and returns them as a list of dictionaries."""
    connection = sqlite3.connect(DATABASE_NAME)
    try:
        cursor = connection.cursor()
        # SQL command to fetch all records
        SELECT_QUERY = "SELECT recycle_type, timestamp FROM recycle_data ORDER BY timestamp DESC;"
        cursor.execute(SELECT_QUERY)
        rows = cursor.fetchall()
        # Convert rows to a list of dictionaries
        records = [{"recycle_type": row[0], "timestamp": row[1]} for row in rows]
        return records
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        return []
    finally:
        connection.close()

def insert_collect_trash(trash_type):
    connection = sqlite3.connect(DATABASE_NAME)
    try:
        cursor = connection.cursor()

        # Inserting a new trash collection record with the current timestamp
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        insert_query = "INSERT INTO trash_collected (date_time_collected, trash_type, amount) VALUES (?, ?, ?)"
        
        # You can define the amount (e.g., a fixed value for now)
        amount = 1  # This can be dynamic if you have a value for the amount
        
        cursor.execute(insert_query, (timestamp, trash_type, amount))
        connection.commit()

        # Fetch the last few records (e.g., the most recent record)
        select_query = "SELECT id, date_time_collected, trash_type, amount FROM trash_collected ORDER BY date_time_collected DESC LIMIT 5;"
        cursor.execute(select_query)
        records = cursor.fetchall()

        return records  # Return the fetched records (you can format this as needed)

    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        return []
    finally:
        connection.close()

def retrieve_trashT():
    connection = sqlite3.connect(DATABASE_NAME)
    trash_data = {}  # Dictionary to hold the results
    try:
        cursor = connection.cursor()
        
        # Queries to fetch data based on trash type
        queries = {
            "Paper": "SELECT * FROM trash_collected WHERE trash_type = 'Paper' ORDER BY date_time_collected DESC",
            "Metal": "SELECT * FROM trash_collected WHERE trash_type = 'Metal' ORDER BY date_time_collected DESC",
            "Plastic": "SELECT * FROM trash_collected WHERE trash_type = 'Plastic' ORDER BY date_time_collected DESC",
            "Waste": "SELECT * FROM trash_collected WHERE trash_type = 'Waste' ORDER BY date_time_collected DESC"
        }

        
        # Get column names for the table
        cursor.execute("PRAGMA table_info(trash_collected)")
        columns = [info[1] for info in cursor.fetchall()]  # Extract column names
        
        # Execute each query and store results in the dictionary
        for trash_type, query in queries.items():
            cursor.execute(query)
            rows = cursor.fetchall()
            trash_data[trash_type] = [dict(zip(columns, row)) for row in rows]

    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        return {}
    finally:
        connection.close()
    
    return trash_data

def retrieved_recycle():
    connection = sqlite3.connect(DATABASE_NAME)
    recycle_data = []  # List to hold the results
    try:
        cursor = connection.cursor()
        
        # Fetch all rows from the recycle_data table
        cursor.execute("SELECT * FROM recycle_data ORDER BY timestamp DESC")
        rows = cursor.fetchall()
        
        # Get column names dynamically
        cursor.execute("PRAGMA table_info(recycle_data)")
        columns = [info[1] for info in cursor.fetchall()]  # Extract column names
        
        # Convert rows to a list of dictionaries
        recycle_data = [dict(zip(columns, row)) for row in rows]  # Ensure recycle_data is a list

    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        return {}
    finally:
        connection.close()
    
    return recycle_data

if __name__ == "__main__":
    # Create the database and table
    create_database_and_table()

    # Example of inserting data
    # Uncomment to test the insert functionality
    insert_data("plastic")
    insert_data("metal")
    insert_data("paper")

    # Fetch and print all records
    records = get_all_records()
    print("All records:", records)