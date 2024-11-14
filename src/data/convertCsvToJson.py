import csv
import json

def convert_csv_to_json(csv_filename, json_filename):
    # Open the CSV file for reading
    with open(csv_filename, mode='r', encoding='utf-8') as csv_file:
        # Use DictReader to read the CSV into a list of dictionaries
        csv_reader = csv.DictReader(csv_file)
        
        # Convert each row in CSV to a dictionary
        data = []
        for row in csv_reader:
            # Convert CSV row to dictionary, and append to the data list
            data.append({
                "id": row["id"],
                "puzzle": row["puzzle"],
                "solution": row["solution"],
                "clues": row["clues"],
                "difficulty": row["difficulty"]
            })
    
    # Write the JSON file
    with open(json_filename, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)

    print(f"Data successfully converted to {json_filename}")

# Usage example:
convert_csv_to_json('sudoku-3m.csv', 'sudoku.json')
