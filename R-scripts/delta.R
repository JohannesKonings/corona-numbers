library(readr)
library(dplyr)
library(data.table)
library(tidyr)

#https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv
#/time_series_covid19_recovered_global.csv
#/time_series_covid19_deaths_global.csv

# data cleaning
confirmed_global  <- read_csv("time_series_covid19_confirmed_global.csv", col_names = TRUE)
confirmed_germany <- confirmed_global %>% filter(`Country/Region` == 'Germany')
confirmed_germany <- data.frame(t(confirmed_germany))
confirmed_germany <- setDT(confirmed_germany, keep.rownames = TRUE)[]
colnames(confirmed_germany) <- c("date", "no")
confirmed_germany <- tail(confirmed_germany, -4)
confirmed_germany$date <- as.Date(confirmed_germany$date, "%m/%d/%y")
confirmed_germany$no   <- as.numeric(as.character(confirmed_germany$no))

#calculation
confirmed_germany <- confirmed_germany %>% mutate(delta_abs     =  no - lag(no))
confirmed_germany <- confirmed_germany %>% mutate(delta_percent =  ( ( no / lag(no) ) * 100 ) - 100 )

#extend
current_max_date = confirmed_germany[which.max(as.POSIXct(confirmed_germany$date)), ]$date
current_no       = confirmed_germany[which.max(as.POSIXct(confirmed_germany$date)), ]$no
min_date = current_max_date + 1
max_date = min_date + 30

confirmed_germany <- confirmed_germany %>% complete(date = seq.Date(min(min_date), max(max_date), by = "day"))
confirmed_germany <- confirmed_germany[order(as.Date(confirmed_germany$date, format="%Y-%m-%d")),]

confirmed_germany <- confirmed_germany %>% mutate(no_10 = case_when(date == current_max_date ~ current_no))
confirmed_germany <- confirmed_germany %>% mutate(no_15 = case_when(date == current_max_date ~ current_no))
confirmed_germany <- confirmed_germany %>% mutate(no_20 = case_when(date == current_max_date ~ current_no))
confirmed_germany <- confirmed_germany %>% mutate(no_25 = case_when(date == current_max_date ~ current_no))


for (row in 2:dim(confirmed_germany)[1]) {
  if (confirmed_germany[row,]$date > current_max_date) {
    confirmed_germany[row,] <- mutate(confirmed_germany[1:row,], no_10 = lag(no_10,1) * 1.1 )[row,]
    confirmed_germany[row,] <- mutate(confirmed_germany[1:row,], no_15 = lag(no_10,1) * 1.15 )[row,]
    confirmed_germany[row,] <- mutate(confirmed_germany[1:row,], no_20 = lag(no_10,1) * 1.2 )[row,]
    confirmed_germany[row,] <- mutate(confirmed_germany[1:row,], no_25 = lag(no_10,1) * 1.25 )[row,]
  }
}

write.csv2(confirmed_germany, "time_series_covid19_confirmed_global_extrapolation_20201030.csv")

