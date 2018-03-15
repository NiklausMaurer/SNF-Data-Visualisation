
import csv, sqlite3, os

if not os.path.exists("Generated"):
    os.makedirs("Generated")

dbFile = "Generated/data.db"

if os.path.isfile(dbFile): os.remove(dbFile)

con = sqlite3.connect(dbFile)
cur = con.cursor()
cur.execute("CREATE TABLE Output (ProjectNumber, Type, Title, Url, Year);")

with open('Downloaded/P3_GrantOutputDataExport.csv', 'r', encoding="utf-8-sig") as csvfile:
    csvreader = csv.DictReader(csvfile, delimiter=';', quotechar='"')
    to_db = [(row['Project Number'], row['Output Type'], row['Output Title'], row['Url'], row['Year']) for row in csvreader]

cur.executemany("INSERT INTO Output (ProjectNumber, Type, Title, Url, Year) VALUES (?, ?, ?, ?, ?);", to_db)
con.commit()
con.close()

