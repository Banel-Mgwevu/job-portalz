import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import os

def download_resource(url, save_folder):
    response = requests.get(url)
    if response.status_code == 200:
        # Get the file name from the URL
        parsed_url = urlparse(url)
        filename = os.path.join(save_folder, os.path.basename(parsed_url.path))
        
        # Save the resource
        with open(filename, 'wb') as f:
            f.write(response.content)

def scrape_page(url):
    # Send a GET request to the URL
    response = requests.get(url)
    
    # Parse the HTML content
    soup = BeautifulSoup(response.content, "html.parser")
    
    # Create a folder to save resources
    save_folder = "scraped_data"
    if not os.path.exists(save_folder):
        os.makedirs(save_folder)
    
    # Extract and download CSS files
    css_links = [urljoin(url, link['href']) for link in soup.find_all('link', {'rel': 'stylesheet'})]
    for css_link in css_links:
        download_resource(css_link, save_folder)
    
    # Extract and download JavaScript files
    script_links = [urljoin(url, script['src']) for script in soup.find_all('script', {'src': True})]
    for script_link in script_links:
        download_resource(script_link, save_folder)
    
    # Extract and download images
    img_links = [urljoin(url, img['src']) for img in soup.find_all('img', {'src': True})]
    for img_link in img_links:
        download_resource(img_link, save_folder)
    
    # Extract and download fonts
    font_links = [urljoin(url, link['href']) for link in soup.find_all('link', {'rel': 'stylesheet', 'type': 'font/woff2'})]
    for font_link in font_links:
        download_resource(font_link, save_folder)
    
    # Save HTML content
    with open(os.path.join(save_folder, "page.html"), "w", encoding="utf-8") as file:
        file.write(soup.prettify())

# URL of the webpage to scrape
url = "https://www.lovefrom.com/"

# Scrape the page
scrape_page(url)

print("Page scraped successfully.")
