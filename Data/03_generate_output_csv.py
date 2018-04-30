import sqlite3, csv, uuid
 
dbFile = "Generated/data.db"

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

with sqlite3.connect(dbFile) as con:

    con.row_factory = dict_factory

    cur = con.cursor()
    cur.execute("""
select		Output.Type,
			Grant.Generated_Discipline as Discipline,
			Grant.Generated_AmountCategory as AmountCatecory,
			Institution.Proposed as InstitutionType,
			count(*) as Count
from		Output
			inner join Grant on Grant.ProjectNumber = Output.ProjectNumber
			inner join Institution on Institution.ResearchInstitution = Grant.University
where		Grant.Generated_AmountCategory != 'unknown'
group by	Output.Type,
			Grant.Generated_Discipline,
			Grant.Generated_AmountCategory,
			Grant.DisciplineName
""")

    csvWriter = csv.writer(open("Generated/data.csv", mode="w", encoding="utf-8", newline=''), delimiter=',', quotechar='"')

    rowsCSV = list()

    rowsCSV.append(("Id",
                    "Type",
                    "Discipline",
                    "AmountCatecory",
                    "InstitutionType",
                    "Count"
                    ))


    for row in cur.fetchall():

        rowCSV = (  uuid.uuid4().hex,
                    row["Type"],
                    row["Discipline"],
                    row["AmountCatecory"],
                    row["InstitutionType"],
                    row["Count"]
                    )

        rowsCSV.append(rowCSV)

    csvWriter.writerows(rowsCSV)

 
