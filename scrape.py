import requests

def fetch_google_reviews(api_key, place_id):
    url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=name,rating,reviews&key={api_key}"
    response = requests.get(url)
    data = response.json()
    if 'result' in data:
        return data['result'].get('reviews', [])
    else:
        print("Error:", data.get('error_message', 'Unknown error'))
        return []

def main():
    # Google API Key with access to the Places API
    api_key = "YOUR_API_KEY"

    # Place ID of the restaurant in Arlington, VA
    place_id = "PLACE_ID_OF_RESTAURANT_IN_ARLINGTON_VA"

    # Fetch reviews
    reviews = fetch_google_reviews(api_key, place_id)

    # Print reviews
    for review in reviews:
        print(f"Author: {review['author_name']}")
        print(f"Rating: {review['rating']}")
        print(f"Review: {review['text']}")
        print()

if __name__ == "__main__":
    main()
