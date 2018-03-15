
import csv

with open('Downloaded/P3_GrantOutputDataExport.csv', 'r', encoding="utf-8-sig") as csvfile:
    csvreader = csv.DictReader(csvfile, delimiter=';', quotechar='"')
    for row in csvreader:
        print(row["Output Type"])
