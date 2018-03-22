

data <- read.csv2("../Generated/Export.csv")


data$Type <- as.factor(data$Type)
data$Year <- as.numeric(data$Year)
data$DisciplineNameHierarchy <- as.factor(data$DisciplineNameHierarchy)
data$DisciplineName <- as.factor(data$DisciplineName)
data$Institution <- as.factor(data$Institution)
data$FundingInstrumentHierarchy <- as.factor(data$FundingInstrumentHierarchy)
data$FundingInstrument <- as.factor(data$FundingInstrument)



