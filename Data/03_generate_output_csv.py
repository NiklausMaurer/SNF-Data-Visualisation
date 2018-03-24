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
    SELECT	Output.ProjectNumber,
            Output.Type,
            Output.Title,
            Output.Url,
            Output.Year,
            Grant.DisciplineNameHierarchy,
            Grant.DisciplineName,
            Grant.Institution,
            Grant.FundingInstrumentHierarchy,
            Grant.FundingInstrument,
            Grant.StartDate,
            Grant.EndDate,
            Grant.ApprovedAmount
    FROM	Output
            inner join Grant on Grant.ProjectNumber = Output.ProjectNumber
""")

    csvWriter = csv.writer(open("Generated/Output.csv", "w", encoding="utf-8", newline=''))

    rowsCSV = list()
    for row in cur.fetchall():

        fundingInstrumentHierarchy = row["FundingInstrumentHierarchy"].split(";")
        disciplineNameHierarchy = row["DisciplineNameHierarchy"].split(";")
        
        rowCSV = (  row["ProjectNumber"],
                    row["Type"],
                    row["Title"],
                    row["Type"],
                    row["Url"],
                    row["Year"],
                    disciplineNameHierarchy[0],
                    disciplineNameHierarchy[1] if len(disciplineNameHierarchy) > 1 else "",
                    row["DisciplineName"],
                    row["Institution"],
                    fundingInstrumentHierarchy[0],
                    fundingInstrumentHierarchy[1] if len(fundingInstrumentHierarchy) > 1 else "",
                    row["FundingInstrument"],
                    row["StartDate"],
                    row["EndDate"],
                    row["ApprovedAmount"]
                    )

        rowsCSV.append(rowCSV)

    csvWriter.writerows(rowsCSV)

 
