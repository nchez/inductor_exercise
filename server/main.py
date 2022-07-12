
from flask import Flask, jsonify, request
from flask_cors import CORS
import csv, json

app = Flask(__name__)
CORS(app, supports_credentials=True)

def populate_stock_prices(line, arr, tickers_arr, prices):
    for i in range(len(arr)):
                price_data = line[arr[i]]
                if tickers_arr[i] not in prices:
                    prices[tickers_arr[i]] = []
                prices[tickers_arr[i]].append(price_data)
    

@app.route("/")
def hello_world():
    values = {'name': 12}
    # file = open('users.json').read()
    # print(type(file))
    # with open('users.json') as json_file:
    #     data = json.load(json_file)
    #     print(type(data))
    #     return file
    return values

@app.route("/stock_data/single/<ticker>", methods=['GET'])
def get_stock_data(ticker):
    search_args = request.args
    # check search args to see if exist
    if search_args.get('start') is not None and search_args.get('end') is not None:
        start_year = search_args.get('start')
        end_year = search_args.get('end')
    elif search_args.get('start') is not None:
        start_year = search_args.get('start')
        end_year = ''
    elif search_args.get('end') is not None:
        end_year = search_args.get('end')
        start_year = ''
    else:
        start_year = ''
        end_year = ''
    # initialize dict to send as resposne
    response = {'dates':[], 'prices': []}
    # open csv file and iterate through file to create json resposne
    with open('stock_data.csv', newline='') as csvfile:
        stockreader = csv.reader(csvfile, delimiter=',')
        line_count = 0
        for line in stockreader:
            if line_count == 0:
                print(ticker.upper())
                try:
                    ticker_index = line.index(ticker.upper())
                except:
                    return {'msg': 'This stock ticker does not have any data'}
            else:
                # logic for start year and end year
                if start_year != '' and end_year !='':
                    if int(line[0][-2:]) >= int(start_year[-2:]) and int(line[0][-2:]) <=int(end_year[-2:]):
                        response['dates'].append(line[0])
                        response['prices'].append(line[ticker_index])
                elif start_year != '':
                    if int(line[0][-2:]) >= int(start_year[-2:]):
                        response['dates'].append(line[0])
                        response['prices'].append(line[ticker_index])
                elif end_year != '':
                    if int(line[0][-2:]) <= int(end_year[-2:]):
                        response['dates'].append(line[0])
                        response['prices'].append(line[ticker_index])
                else:
                    response['dates'].append(line[0])
                    response['prices'].append(line[ticker_index])
            line_count += 1
        # sort dates in increasing order, sort prices accordingly
        response['dates'].reverse()
        response['prices'].reverse()
        return response


@app.route("/stock_data/multi", methods=['POST'])
def post_multi_stock():
    # grab form data if exists
    tickers = request.form.get('tickers')
    try:
        start = request.form.get('start')
    except:
        start = ''
    try:
        end = request.form.get('end')
    except:
        end = ''
    # initialize tickers array (could not get array working in postman form-data)
    tickers_arr = tickers.split()
    # initialize stock index array
    stock_indexes = []
    # initialize prices object to populate stocks and array of their prices. initalize date array -- these will be sent in API response
    prices = {}
    dates = []

    # iterate through csv file to: populate price object and date array, make sure tickers all exist
    with open('stock_data.csv', newline='') as csvfile:
        stockreader = csv.reader(csvfile, delimiter=',')
        headers = next(stockreader)
        for i in range(len(tickers_arr)):
            tickers_arr[i]=tickers_arr[i].replace('[','').replace(']','').replace(',','')
            tickers_arr[i].upper()
            if tickers_arr[i] not in headers:
                # error msg if stock not in csv file
                return {'msg':'one of the requested stocks is not available'}
            else:
                # add stock index to array
                stock_indexes.append(headers.index(tickers_arr[i]))
                continue
        linecount = 0
        # populate date array and prices object
        for line in stockreader:
            if linecount == 0:
                linecount += 1
                continue
            if start != '' and end !='':
                if int(line[0][-2:]) >= int(start[-2:]) and int(line[0][-2:]) <=int(end[-2:]):
                    dates.append(line[0])
                    populate_stock_prices(line, stock_indexes, tickers_arr, prices)
            elif start != '':
                if int(line[0][-2:]) >= int(start[-2:]):
                    dates.append(line[0])
                    populate_stock_prices(line, stock_indexes, tickers_arr, prices)
            elif end != '':
                if int(line[0][-2:]) <= int(end[-2:]):
                    dates.append(line[0])
                    populate_stock_prices(line, stock_indexes, tickers_arr, prices)
            else:
                dates.append(line[0])
                populate_stock_prices(line, stock_indexes, tickers_arr, prices)
            linecount += 1
    # sort dates array and prices arrays in ascending order
    dates.reverse()
    for key in prices:
        prices[key].reverse()
    return ({'tickers': tickers_arr, 'start': start, 'end': end, 'prices': prices, 'dates': dates})
   