
import csv, sqlite3, os

if not os.path.exists("Generated"):
    os.makedirs("Generated")

dbFile = "Generated/data.db"

if os.path.isfile(dbFile): os.remove(dbFile)

def getAmountCategory(approvedAmount):

    try:
        approvedAmount = float(approvedAmount)
    except ValueError:
        return "unknown"

    if(approvedAmount <  1): return "0"
    if(approvedAmount <  200000): return "1 - 200'000"
    if(approvedAmount <  400000): return "200'000 - 400'000"
    if(approvedAmount <  600000): return "400'000 - 600'000"
    if(approvedAmount <  800000): return "600'000 - 800'000"
    if(approvedAmount < 1000000): return "800'000 - 1'000'000"
    return "1'000'000+"


with sqlite3.connect(dbFile) as con:

    cur = con.cursor()
    cur.execute("""CREATE TABLE Grant (
        ProjectNumber INTEGER,
        Title TEXT,
        ResponsibleApplicant TEXT,
        FundingInstrument TEXT,
        FundingInstrumentHierarchy TEXT,
        Institution TEXT,
        InstitutionCountry TEXT,
        University TEXT,
        DisciplineNumber INTEGER,
        DisciplineName TEXT,
        DisciplineNameHierarchy TEXT,
        AllDisciplines TEXT,
        StartDate TEXT,
        EndDate TEXT,
        ApprovedAmount INTEGER,
        Keywords TEXT,
        Generated_Discipline TEXT,
        Generated_AmountCategory TEXT);""")

    with open('Downloaded/P3_GrantExport.csv', 'r', encoding="utf-8-sig") as csvfile:
        csvreader = csv.DictReader(csvfile, delimiter=';', quotechar='"')

        to_db = []
        for row in csvreader:

            generatedDiscipline = row['Discipline Name Hierarchy'].split(';')[0]
            generatedAmountCategory = getAmountCategory(row['Approved Amount'])
            
            to_db.append((row['Project Number'],row['Project Title'], row['Responsible Applicant'], row['Funding Instrument'], row['Funding Instrument Hierarchy'], row['Institution'], row['Institution Country'], row['University'], row['Discipline Number'], row['Discipline Name'], row['Discipline Name Hierarchy'], row['All disciplines'], row['Start Date'], row['End Date'], row['Approved Amount'], row['Keywords'], generatedDiscipline, generatedAmountCategory))

        
    cur.executemany("INSERT INTO Grant (ProjectNumber, Title, ResponsibleApplicant, FundingInstrument, FundingInstrumentHierarchy, Institution, InstitutionCountry, University, DisciplineNumber, DisciplineName, DisciplineNameHierarchy, AllDisciplines, StartDate, EndDate, ApprovedAmount, Keywords, Generated_Discipline, Generated_AmountCategory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", to_db)
    con.commit()


    cur = con.cursor()
    cur.execute("""CREATE TABLE Output (
        ProjectNumber INTEGER,
        Type TEXT,
        Title TEXT,
        Url TEXT,
        Year INTEGER,
        FOREIGN KEY(ProjectNumber) REFERENCES Grant(ProjectNumber))""")

    with open('Downloaded/P3_GrantOutputDataExport.csv', 'r', encoding="utf-8-sig") as csvfile:
        csvreader = csv.DictReader(csvfile, delimiter=';', quotechar='"')
        to_db = [(row['Project Number'], row['Output Type'], row['Output Title'], row['Url'], row['Year']) for row in csvreader]

    cur.executemany("INSERT INTO Output (ProjectNumber, Type, Title, Url, Year) VALUES (?, ?, ?, ?, ?);", to_db)
    con.commit()


    cur = con.cursor()
    cur.execute("""CREATE TABLE Publication (
        PublicationIDSNSF TEXT,
        ProjectNumber INTEGER,
        PeerReviewStatus TEXT,
        TypeOfPublication TEXT,
        TitleOfPublication TEXT,
        Authors TEXT, Status TEXT,
        PublicationYear,
        ISBN TEXT,
        DOI TEXT,
        ImportSource TEXT,
        OpenAccessStatus TEXT,
        OpenAccessType TEXT,
        OpenAccessURL TEXT,
        BookTitle TEXT,
        Publisher TEXT,
        Editors TEXT,
        JournalTitle TEXT,
        Volume TEXT,
        IssueOrNumber TEXT,
        PageFrom INTEGER,
        PageTo INTEGER,
        ProceedingTitle TEXT,
        ProceedingPlace TEXT,
        Abstract TEXT,
        FOREIGN KEY(ProjectNumber) REFERENCES Grant(ProjectNumber));""")

    with open('Downloaded/P3_PublicationExport.csv', 'r', encoding="utf-8-sig") as csvfile:
        csvreader = csv.DictReader(csvfile, delimiter=';', quotechar='"')
        to_db = [(row['Publication ID SNSF'], row['Project Number'], row['Peer Review Status'], row['Type of Publication'], row['Title of Publication'], row['Authors'], row['Status'], row['Publication Year'], row['ISBN'], row['DOI'], row['Import Source'], row['Open Access Status'], row['Open Access Type'], row['Open Access URL'], row['Book Title'], row['Publisher'], row['Editors'], row['Journal Title'], row['Volume'], row['Issue / Number'], row['Page from'], row['Page to'], row['Proceeding Title'], row['Proceeding Place'], row['Abstract']) for row in csvreader]

    cur.executemany("INSERT INTO Publication (PublicationIDSNSF, ProjectNumber, PeerReviewStatus, TypeOfPublication, TitleOfPublication, Authors, Status, PublicationYear, ISBN, DOI, ImportSource, OpenAccessStatus, OpenAccessType, OpenAccessURL, BookTitle, Publisher, Editors, JournalTitle, Volume, IssueOrNumber, PageFrom, PageTo, ProceedingTitle, ProceedingPlace, Abstract) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", to_db)
    con.commit()


    cur = con.cursor()
    cur.execute("""CREATE TABLE Collaboration (
        ProjectNumber INTEGER,
        GroupOrPerson TEXT,
        TypesOfCollaboration TEXT,
        Country TEXT,
        ProjectStartDate TEXT,
        ProjectEndDate TEXT,
        FOREIGN KEY(ProjectNumber) REFERENCES Grant(ProjectNumber));""")

    with open('Downloaded/P3_CollaborationExport.csv', 'r', encoding="utf-8-sig") as csvfile:
        csvreader = csv.DictReader(csvfile, delimiter=';', quotechar='"')
        to_db = [(row['Project Number'], row['Group/Person'], row['Types of collaboration'], row['Country'], row['Project Start Date'], row['Project End Date']) for row in csvreader]

    cur.executemany("INSERT INTO Collaboration (ProjectNumber, GroupOrPerson, TypesOfCollaboration, Country, ProjectStartDate, ProjectEndDate) VALUES (?, ?, ?, ?, ?, ?);", to_db)
    con.commit()


    cur = con.cursor()
    cur.execute("""CREATE TABLE Institution (
        Number INTEGER,
        ResearchInstitution TEXT,
        ResearchInstitution_De TEXT,
        ResearchInstitutionAbbr TEXT,
        Type TEXT,
        Type_De TEXT,
        Proposed TEXT)
        """)

    with open('Additional/mapping_institutions_with_institution-types.csv', 'r', encoding="utf-8-sig") as csvfile:
        csvreader = csv.DictReader(csvfile, delimiter=';')
        to_db = [(row['Number'], row['ResearchInstitution'], row['ResearchInstitution_De'], row['ResearchInstitutionAbbr'], row['Type'], row['Type_De'], row['Proposition For You']) for row in csvreader]

    cur.executemany("INSERT INTO Institution (Number, ResearchInstitution, ResearchInstitution_De, ResearchInstitutionAbbr, Type, Type_De, Proposed) VALUES (?, ?, ?, ?, ?, ?, ?);", to_db)
    con.commit()
