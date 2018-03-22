
select		Output.*,
			Grant.DisciplineNameHierarchy,
			Grant.DisciplineName,
			Grant.Institution,
			Grant.FundingInstrumentHierarchy,
			Grant.FundingInstrument
from		Output
			inner join Grant on Grant.ProjectNumber = Output.ProjectNumber
