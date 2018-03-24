

data <- read.csv2("../Generated/Output.csv")


data$Type <- as.factor(data$Type)
data$Year <- as.numeric(data$Year)
data$DisciplineLevel1 <- as.factor(data$DisciplineLevel1)
data$DisciplineLevel2 <- as.factor(data$DisciplineLevel2)
data$DisciplineLevel3 <- as.factor(data$DisciplineLevel3)
data$Institution <- as.factor(data$Institution)
data$FundingInstrumentLevel1 <- as.factor(data$FundingInstrumentLevel1)
data$FundingInstrumentLevel2 <- as.factor(data$FundingInstrumentLevel2)
data$FundingInstrumentLevel3 <- as.factor(data$FundingInstrumentLevel3)
data$ApprovedAmount <- as.numeric(data$ApprovedAmount)



library(ggplot2)     

s <- as.data.frame(table(data$Type, data$DisciplineLevel1))


g <- ggplot(data, aes(x=Year, y=ApprovedAmount)) + geom_point()
plot(g)


ggplot(s, aes(x=Var1, y=Var2)) + geom_point(aes(col=Var1, size=Freq))
