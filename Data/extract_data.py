
import csv, sqlite3, os

if not os.path.exists("Generated"):
    os.makedirs("Generated")

dbFile = "Generated/data.db"

if os.path.isfile(dbFile): os.remove(dbFile)

con = sqlite3.connect(dbFile)


cur = con.cursor()
cur.execute("CREATE TABLE Grant (ProjectNumber INTEGER, Title TEXT, ResponsibleApplicant TEXT, FundingInstrument TEXT, FundingInstrumentHierarchy TEXT, Institution TEXT, InstitutionCountry TEXT, University TEXT, DisciplineNumber INTEGER, DisciplineName TEXT, DisciplineNameHierarchy TEXT, AllDisciplines TEXT, StartDate TEXT, EndDate TEXT, ApprovedAmount INTEGER, Keywords TEXT);")

with open('Downloaded/P3_GrantExport.csv', 'r', encoding="utf-8-sig") as csvfile:
    csvreader = csv.DictReader(csvfile, delimiter=';', quotechar='"')
    to_db = [(row['Project Number'], row['Project Title'], row['Responsible Applicant'], row['Funding Instrument'], row['Funding Instrument Hierarchy'], row['Institution'], row['Institution Country'], row['University'], row['Discipline Number'], row['Discipline Name'], row['Discipline Name Hierarchy'], row['All disciplines'], row['Start Date'], row['End Date'], row['Approved Amount'], row['Keywords']) for row in csvreader]

cur.executemany("INSERT INTO Grant (ProjectNumber, Title, ResponsibleApplicant, FundingInstrument, FundingInstrumentHierarchy, Institution, InstitutionCountry, University, DisciplineNumber, DisciplineName, DisciplineNameHierarchy, AllDisciplines, StartDate, EndDate, ApprovedAmount, Keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", to_db)
con.commit()


cur = con.cursor()
cur.execute("CREATE TABLE Output (ProjectNumber INTEGER, Type TEXT, Title TEXT, Url TEXT, Year INTEGER);")

with open('Downloaded/P3_GrantOutputDataExport.csv', 'r', encoding="utf-8-sig") as csvfile:
    csvreader = csv.DictReader(csvfile, delimiter=';', quotechar='"')
    to_db = [(row['Project Number'], row['Output Type'], row['Output Title'], row['Url'], row['Year']) for row in csvreader]

cur.executemany("INSERT INTO Output (ProjectNumber, Type, Title, Url, Year) VALUES (?, ?, ?, ?, ?);", to_db)
con.commit()


con.close()

