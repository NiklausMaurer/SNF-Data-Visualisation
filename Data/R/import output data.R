

data <- read.csv2("../Generated/Export.csv")


data$Type <- as.factor(data$Type)
data$Year <- as.numeric(data$Year)
data$DisciplineLevel1 <- as.factor(data$DisciplineLevel1)
data$DisciplineLevel2 <- as.factor(data$DisciplineLevel2)
data$DisciplineLevel3 <- as.factor(data$DisciplineLevel2)
data$Institution <- as.factor(data$Institution)
data$FundingInstrumentHierarchy <- as.factor(data$FundingInstrumentHierarchy)
data$FundingInstrument <- as.factor(data$FundingInstrument)


library(ggplot2)     

s <- as.data.frame(table(data$Type, data$DisciplineLevel1))



ggplot(s, aes(x=s$Var1, y=s$Var2))
+ geom_point(aes(size = s$Freq, colour = Price, alpha=.02))
