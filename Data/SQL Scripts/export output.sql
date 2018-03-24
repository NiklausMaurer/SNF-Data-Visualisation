
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
				

