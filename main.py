import requests
data = {"token":"5256936828:mK79GQ0Z", "request":"${userPhone}", "limit": 100, "lang":"en"}
url = 'https://leakosintapi.com/' 
response = requests.post(url, json=data) 
print(response.json()) 