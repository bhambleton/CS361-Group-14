# READ ME: This script should not need to be run more than 3 times a day
# NOTE: External libraries used {BeautifulSoup, requests, geopy}

import requests
from bs4 import BeautifulSoup
import csv
import geopy.geocoders
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter

zipCode = 97330

address = 'https://corvallis.craigslist.org/search/jjj?search_distance=5&postal=' + str(zipCode)

# COMMENT: Go get the main webpage HTML and assign it to 'soup'
response = requests.get(address)
soup = BeautifulSoup(response.text, 'html.parser')

print('\n')

# COMMENT: create the inital csv file containing the list of jobs with the first row being the lables
with open('../jobList.csv', 'w') as jobList:
    jobWriter = csv.writer(jobList, delimiter = '|')
    jobWriter.writerows([['Title', 'Description', 'URL', 'Street', 'City', 'ZIP']])
jobList.close()

# COMMENT: Ceate an array of all HTML lines that contain a link to a job page
links = soup.findAll(attrs={'class':'result-title hdrlnk'})

# COMMENT: Creates a list of post with a unique title with the name nonDuplicates
# COMMENT: Initializes the nonDuplicates list with the first post
nonDuplicates = [links[0]]
for dup in links:
        # COMMENT: any() will return True if the current post being checked is found at least once in the list of nonDuplicates and false otherwise
    if not any(dup.text in elem for elem in nonDuplicates):
        nonDuplicates.append(dup)

count = 0
for url in nonDuplicates:
    count = (count + 1)

    # COMMENT: Get the address of the next job webpage
    jobURL = url["href"]

    # COMMENT: Go get the job webpage HTML --> obSoup
    response2 = requests.get(jobURL)
    jobSoup = BeautifulSoup(response2.text, 'html.parser')

    # COMMENT: Grab the needed data from this job's webpage
    Description = jobSoup.find(attrs={'name':'description'})
    Title =  jobSoup.find(attrs={'property':'og:title'})
    LatLong = jobSoup.find(attrs={'name':'geo.position'})

    # COMMENT: Clean the Description and Title before writing them to the csv file
    filteredTitle = Title["content"].encode("ascii", errors = "ignore").decode().replace("|", "")
    filteredDesc = Description["content"].encode("ascii", errors = "ignore").decode().replace("|", "")

    # COMMENT: replace the semicolon in LatLong with a comma
    coordinates = LatLong["content"].replace(';', ', ')

    # COMMENT: Changes the default user_agent value
    geopy.geocoders.options.default_user_agent = 'job_location_finder/1'

    # COMMENT: create an object to call the geolocator api OpenStreetMap
    geolocator = Nominatim()

    # COMMENT: Should add a 1 second delay between each reverse geoseach
    geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1)  # NOTE: COMMENT THIS LINE OUT IF YOU PLAN TO RUN THE SCRIPT FOR EXTENDED PERIODS OF TIME

    # COMMENT: pass the coordinates to the geolocator to preform a reverse search
    location = str(geolocator.reverse(coordinates)).split(',')  # NOTE: COMMENT THIS LINE OUT IF YOU PLAN TO RUN THE SCRIPT FOR EXTENDED PERIODS OF TIME

    # COMMENT: variables containing the street, city, and zip code of the current job
    jobStreet = location[len(location)-6]
    jobCity = location[len(location)-5]
    jobZip = location[len(location)-2]

    # COMMENT: Print the relevant information --- Soon to be exported to a CSV file
    print(Title["content"])
    print(jobURL)
    print('Lat, Long: ' + coordinates)
    print(Description["content"])

    print(jobStreet + ', ' + jobCity + ', ' + jobZip)

    print('\n')

    # NOTE: The csv file is delimited using the pipe ('|') instead of a comma so the grammar of the description can remain intact
    # COMMENT: Writes the current job to the jobList csv file
    with open('../jobList.csv', 'a') as jobList:
        jobWriter = csv.writer(jobList, delimiter = '|')
        jobWriter.writerow([filteredTitle, filteredDesc, jobURL, jobStreet, jobCity, jobZip])
    jobList.close()

    # COMMENT: For Testing, limit the number of jobs obtained to 10
    if count > 9:
        break
