#Kmer Explorer

##To-do:
* Delete files after period (24h)
* Accept email to send the files
* More complete report
* Change upload file button appearance when file is added.
* Check file format when uploading (currently crashes the server)
* Allow the user to filter non-frequent kmers
* Show the distribution of kmer frequency
* Remove inefficiency in data formatting in the end
* Finish digital ocean tutorial (https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04)


##How to install in a Digital Ocean server:
* Go to Digital Ocean and create a 5$/month droplet with node.
* Install git (sudo apt-get install git)
* Clone git (git clone https://github.com/martinbaste/kmer-explorer)
* Install the app (cd kmer-explorer && npm install)
* ~~Run the app (node app.js)~~ INSECURE
