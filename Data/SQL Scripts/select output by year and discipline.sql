
select		Output.Type,
			Output.Year,
			Grant.DisciplineNameHierarchy,
			Grant.DisciplineName,
			count(*) as Anzahl
from		Output
			inner join Grant on Grant.ProjectNumber = Output.ProjectNumber
group by	Output.Type,
			Output.Year,
			Grant.DisciplineNameHierarchy,
			Grant.DisciplineName



