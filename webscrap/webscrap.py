import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin  # Import urljoin function

# URL of the webpage to scrape
url = "https://uiuxjobsboard.com/terms"

# Send a GET request to the URL
response = requests.get(url)

# Parse the HTML content
soup = BeautifulSoup(response.content, "html.parser")

# Extract HTML content
html_content = soup.prettify()

# Find and extract CSS links
css_links = [link['href'] for link in soup.find_all('link', {'rel': 'stylesheet'})]

# Extract base URL
base_url = response.url

# Download CSS files and concatenate them into one CSS content
css_content = ""
for css_link in css_links:
    # Construct absolute URL from relative URL
    absolute_css_link = urljoin(base_url, css_link)
    css_response = requests.get(absolute_css_link)
    css_content += css_response.text + "\n"

# Combine HTML and CSS content
final_html = f"<style>{css_content}</style>\n{html_content}"

# Extract text content
text_content = soup.get_text()

# Extract color information from inline styles
inline_styles = soup.find_all(style=True)
colors = set()
for tag in inline_styles:
    style = tag["style"]
    color_matches = re.findall(r'color:\s*(.*?);', style)
    colors.update(color_matches)

# Save HTML content with embedded CSS to a file
with open("page_with_css.html", "w", encoding="utf-8") as file:
    file.write(final_html)

# Save text content to a file
with open("text_content.txt", "w", encoding="utf-8") as file:
    file.write(text_content)

print("HTML file with embedded CSS saved successfully.")
print("Text content extracted and saved successfully.")
print("Colors extracted:", colors)
