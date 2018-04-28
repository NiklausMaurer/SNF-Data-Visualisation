
create table Export as
select		Output.Type,
			Grant.Generated_Discipline as Discipline,
			Grant.Generated_AmountCategory as AmountCatecory,
			Institution.Proposed as InstitutionType,
			count(*) as Anzahl
from		Output
			inner join Grant on Grant.ProjectNumber = Output.ProjectNumber
			inner join Institution on Institution.ResearchInstitution = Grant.University
where		Grant.Generated_AmountCategory != 'unknown'
group by	Output.Type,
			Grant.Generated_Discipline,
			Grant.Generated_AmountCategory,
			Grant.DisciplineName

