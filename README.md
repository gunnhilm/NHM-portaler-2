# NHM-portaler-2

## Installation
### Node
Make sure you have [NodeJS](https://nodejs.org/en/) installed.

Download the portal to a folder on your computer. In a console window form the "NHM-portaler-2" folder run npm -i

### Apache
The portal is setup to run behind a apache server. To run the portal locally on your (windows) computer install Apache from i.e. [Apachelounge](https://www.apachelounge.com/download/), and make the following adjustments:

in the httpd.conf file uncomment the lines:

LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so

in the http-vhost.conf file add this:

<VirtualHost *:80>

    ServerAdmin webmaster@NHM-portaler-2.com
	DocumentRoot "/Apache24/htdocs/NHM-portaler-2/public"
    ServerName localhost
    ErrorLog "logs/NHM-portaler-2.com-error.log"
    CustomLog "logs/NHM-portaler-2.com-access.log" common
	ProxyPass /.well-known/ !
	ProxyPass / http://localhost:3000/
	ProxyPassReverse / http://localhost:3000/
	ProxyPreserveHost On
	

\</VirtualHost>


## Data files
The portal depends on the MUSIT-dump files, containing data about natural history collection in a Darwin core format.

Download the files from the [MUSIT-dump page](http://www.unimus.no/nedlasting/datasett/) and place in the "NHM-portaler-2\src\data" folder.

## Run the portal
In a console window form the "NHM-portaler-2" folder run "npm run start" or "npm run dev" to run development mode. The portal will run on localhst:3000

Start your apache server, if you are using Apachelounge from a console window in the folder  C:\Apache24\bin run "httpd.exe".

## in the browser
Your portal is now available at http://localhost/nhm
