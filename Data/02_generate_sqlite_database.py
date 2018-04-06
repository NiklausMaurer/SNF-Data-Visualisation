
import csv, sqlite3, os

if not os.path.exists("Generated"):
    os.makedirs("Generated")

dbFile = "Generated/data.db"

if os.path.isfile(dbFile): os.remove(dbFile)

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
        Keywords TEXT);""")

    with open('Downloaded/P3_GrantExport.csv', 'r', encoding="utf-8-sig") as csvfile:
        csvreader = csv.DictReader(csvfile, delimiter=';', quotechar='"')
        to_db = [(row['Project Number'], row['Project Title'], row['Responsible Applicant'], row['Funding Instrument'], row['Funding Instrument Hierarchy'], row['Institution'], row['Institution Country'], row['University'], row['Discipline Number'], row['Discipline Name'], row['Discipline Name Hierarchy'], row['All disciplines'], row['Start Date'], row['End Date'], row['Approved Amount'], row['Keywords']) for row in csvreader]

    cur.executemany("INSERT INTO Grant (ProjectNumber, Title, ResponsibleApplicant, FundingInstrument, FundingInstrumentHierarchy, Institution, InstitutionCountry, University, DisciplineNumber, DisciplineName, DisciplineNameHierarchy, AllDisciplines, StartDate, EndDate, ApprovedAmount, Keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", to_db)
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


    con.close()

