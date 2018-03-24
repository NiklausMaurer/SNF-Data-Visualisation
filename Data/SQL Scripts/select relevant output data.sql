


CREATE TABLE Export AS 
select
      Output.*,
			Grant.DisciplineNameHierarchy,
			substr(Grant.DisciplineNameHierarchy, 0,  instr(Grant.DisciplineNameHierarchy, ';')) as 'DisciplineLevel1',
			substr(Grant.DisciplineNameHierarchy, instr(Grant.DisciplineNameHierarchy, ';') + 1, length(Grant.DisciplineNameHierarchy)) as 'DisciplineLevel2',
			Grant.DisciplineName as DisciplineLevel3,
			Grant.Institution,
			Grant.FundingInstrumentHierarchy,
			Grant.FundingInstrument
from		Output
			inner join Grant on Grant.ProjectNumber = Output.ProjectNumber
			
GO

alter table Export add column JournalTitle TEXT
alter table Export add column PublicationType TEXT

insert into Export (ProjectNumber,Type,Title,Url,Year,DisciplineNameHierarchy,DisciplineLevel1,DisciplineLevel2,DisciplineLevel3,Institution,FundingInstrumentHierarchy,FundingInstrument,JournalTitle,PublicationType)
select		Publication.ProjectNumber,
			"Publication",
			Publication.TitleOfPublication,
			null,
			Publication.PublicationYear,
			Grant.DisciplineNameHierarchy,
			substr(Grant.DisciplineNameHierarchy, 0,  instr(Grant.DisciplineNameHierarchy, ';')) as 'DisciplineLevel1',
			substr(Grant.DisciplineNameHierarchy, instr(Grant.DisciplineNameHierarchy, ';') + 1, length(Grant.DisciplineNameHierarchy)) as 'DisciplineLevel2',
			Grant.DisciplineName as DisciplineLevel3,
			Grant.Institution,
			Grant.FundingInstrumentHierarchy,
			Grant.FundingInstrument,
			Publication.JournalTitle,
			Publication.TypeOfPublication
from		Publication
			inner join Grant on Grant.ProjectNumber = Publication.ProjectNumber
			
