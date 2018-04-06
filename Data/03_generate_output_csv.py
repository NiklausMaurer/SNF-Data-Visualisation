import sqlite3, csv
 
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
                Output.Year,
                Grant.DisciplineNameHierarchy,
                count(*) as Count
    from		Output
                inner join Grant on Grant.ProjectNumber = Output.ProjectNumber
    group by	Output.Type,
                Output.Year,
                Grant.DisciplineNameHierarchy
""")

    csvWriter = csv.writer(open("Generated/output_by_year_and_discipline.csv", mode="w", encoding="utf-8", newline=''), delimiter=';', quotechar='"')

    rowsCSV = list()

    rowsCSV.append(("Type",
                    "Year",
                    "Discipline",
                    "Count"
                    ))


    for row in cur.fetchall():

        disciplineNameHierarchy = row["DisciplineNameHierarchy"].split(";")
        
        if(len(disciplineNameHierarchy)) < 2: continue

        rowCSV = (  row["Type"],
                    row["Year"],
                    disciplineNameHierarchy[1],
                    row["Count"]
                    )

        rowsCSV.append(rowCSV)

    csvWriter.writerows(rowsCSV)

 
