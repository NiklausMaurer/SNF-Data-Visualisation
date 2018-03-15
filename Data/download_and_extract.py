
import urllib.request
import os

if not os.path.exists("Downloaded"):
    os.makedirs("Downloaded")

urllib.request.urlretrieve("http://p3.snf.ch/P3Export/P3_PublicationExport.csv", "Downloaded/P3_PublicationExport.csv")
urllib.request.urlretrieve("http://p3.snf.ch/P3Export/P3_GrantOutputDataExport.csv", "Downloaded/P3_GrantOutputDataExport.csv")
urllib.request.urlretrieve("http://p3.snf.ch/P3Export/P3_CollaborationExport.csv", "Downloaded/P3_CollaborationExport.csv")
urllib.request.urlretrieve("http://p3.snf.ch/P3Export/P3_GrantExport.csv", "Downloaded/P3_GrantExport.csv")

