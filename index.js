const scraper = require('website-scraper');

scraper({ urls: ['https://www.wizards.com/dnd/mapper/launcher.htm', 'https://www.wizards.com/dnd/mapper/mapper.htm'], directory: 'public' });