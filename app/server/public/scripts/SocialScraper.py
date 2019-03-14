# READ ME: When using this script please try not to run it for a super long time since the api for geo searching doesn't like people doing bulk searches
# NOTE: External libraries used {BeautifulSoup, requests, geopy}

import requests
from bs4 import BeautifulSoup
import csv

zipCode = 97330

address = 'https://www.wellness.com/find/clinical%20social%20worker/zip-code/' + str(zipCode)

# COMMENT: Go get the main webpage HTML and assign it to 'soup'
response = requests.get(address)
soup = BeautifulSoup(response.text, 'html.parser')

print('\n')

# COMMENT: create the inital csv file containing the list of Social Workers with the first row being the lables
with open('SWList.csv', 'w') as SWList:
    SWWriter = csv.writer(SWList, delimiter = '|')
    SWWriter.writerows([['Name', 'Phone', 'URL', 'Street', 'City', 'State', 'ZIP']])
    SWList.close()

# COMMENT: Ceate an array of all HTML lines that contain a link to a social worker's page
links = soup.findAll(attrs={'itemprop':'name'})

count = 0
for line in links:
    count = (count + 1)
    name = line.get_text()   # COMMENT: This is the name of the SW

    # COMMENT: Get the stub section of the web address and add it to the base URL
    urlData = line.find(attrs={'itemprop':'url'})
    urlStub = urlData["href"]
    fullURL = 'https://www.wellness.com' + urlStub

    # COMMENT: Go get the SW webpage HTML --> SWsoup
    response2 = requests.get(fullURL)
    SWsoup = BeautifulSoup(response2.text, 'html.parser')

    # COMMENT: Grab street, city, and zip code of the current Social Worker
    SWstreet = SWsoup.find(attrs={'class':'address-line1'})
    SWcity = SWsoup.find(attrs={'itemprop':'addressLocality'})
    SWstate = SWsoup.find(attrs={'itemprop':'addressRegion'})
    SWzip = SWsoup.find(attrs={'itemprop':'postalCode'})

    street = SWstreet.getText()
    state = SWstate.getText()
    city = SWcity.getText() 
    ZIP = SWzip.getText()

    # COMMENT: Get the stub section of the web address for the Phone number
    contactData = SWsoup.find(attrs={'title':'Phone Numbers & Directions'})
    urlStub2 = contactData["href"]
    fullURL2 = 'https://www.wellness.com' + urlStub2

    # COMMENT: Get the sub-page with the phone number and retrieve it 
    response3 = requests.get(fullURL2)
    phoneSoup = BeautifulSoup(response3.text, 'html.parser')
    SWphone = phoneSoup.find(attrs={'itemprop':'telephone'})
    phone = SWphone.getText()
    
    # COMMENT: Print Social Worker Data - Soon to go into CSV file
    print(name)
    print(phone)
    print(fullURL)
    print(street)
    print(city)  
    print(state)  
    print(ZIP)
    print('\n')
  
    # NOTE: The csv file is delimited using the pipe ('|') instead of a comma so the grammar of the description can remain intact
    # COMMENT: Writes the current social worker to the SWList csv file
    with open('SWList.csv', 'a') as SWList:
        SWWriter = csv.writer(SWList, delimiter = '|')
        SWWriter.writerow([name, phone, fullURL, street, city, state, ZIP])

    # COMMENT: For Testing, limit the number of jobs obtained to 5
    if count > 4:
        break  

    

