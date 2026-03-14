-- ============================================================
-- MK Stock — Seed: NIFTY LargeMidcap 250 Equities + Top NSE ETFs
-- Source: NSE India (https://www.nseindia.com)
-- Index: NIFTY LargeMidcap 250 (NIFTY 100 Large Cap + NIFTY Midcap 150)
-- Yahoo Finance symbol format: <SYMBOL>.NS
-- Last updated: 2026-03-14
-- ============================================================

INSERT INTO stocks (symbol, name, type, sector, exchange) VALUES

-- ============================================================
-- NIFTY LARGEMIDCAP 250 — Equities
-- ============================================================

-- Automobile & Auto Components
('APOLLOTYRE.NS',  'Apollo Tyres Ltd.',                              'EQUITY', 'Automobile & Auto Components', 'NSE'),
('BAJAJ-AUTO.NS',  'Bajaj Auto Ltd.',                                'EQUITY', 'Automobile & Auto Components', 'NSE'),
('BALKRISIND.NS',  'Balkrishna Industries Ltd.',                     'EQUITY', 'Automobile & Auto Components', 'NSE'),
('BHARATFORG.NS',  'Bharat Forge Ltd.',                              'EQUITY', 'Automobile & Auto Components', 'NSE'),
('BOSCHLTD.NS',    'Bosch Ltd.',                                     'EQUITY', 'Automobile & Auto Components', 'NSE'),
('EICHERMOT.NS',   'Eicher Motors Ltd.',                             'EQUITY', 'Automobile & Auto Components', 'NSE'),
('ENDURANCE.NS',   'Endurance Technologies Ltd.',                    'EQUITY', 'Automobile & Auto Components', 'NSE'),
('ESCORTS.NS',     'Escorts Kubota Ltd.',                            'EQUITY', 'Automobile & Auto Components', 'NSE'),
('EXIDEIND.NS',    'Exide Industries Ltd.',                          'EQUITY', 'Automobile & Auto Components', 'NSE'),
('HEROMOTOCO.NS',  'Hero MotoCorp Ltd.',                             'EQUITY', 'Automobile & Auto Components', 'NSE'),
('HYUNDAI.NS',     'Hyundai Motor India Ltd.',                       'EQUITY', 'Automobile & Auto Components', 'NSE'),
('M&M.NS',         'Mahindra & Mahindra Ltd.',                       'EQUITY', 'Automobile & Auto Components', 'NSE'),
('MARUTI.NS',      'Maruti Suzuki India Ltd.',                       'EQUITY', 'Automobile & Auto Components', 'NSE'),
('MOTHERSON.NS',   'Samvardhana Motherson International Ltd.',       'EQUITY', 'Automobile & Auto Components', 'NSE'),
('MRF.NS',         'MRF Ltd.',                                       'EQUITY', 'Automobile & Auto Components', 'NSE'),
('SCHAEFFLER.NS',  'Schaeffler India Ltd.',                          'EQUITY', 'Automobile & Auto Components', 'NSE'),
('SONACOMS.NS',    'Sona BLW Precision Forgings Ltd.',               'EQUITY', 'Automobile & Auto Components', 'NSE'),
('TIINDIA.NS',     'Tube Investments of India Ltd.',                 'EQUITY', 'Automobile & Auto Components', 'NSE'),
('TMPV.NS',        'Tata Motors Passenger Vehicles Ltd.',            'EQUITY', 'Automobile & Auto Components', 'NSE'),
('TVSMOTOR.NS',    'TVS Motor Company Ltd.',                         'EQUITY', 'Automobile & Auto Components', 'NSE'),
('UNOMINDA.NS',    'UNO Minda Ltd.',                                 'EQUITY', 'Automobile & Auto Components', 'NSE'),

-- Capital Goods
('ABB.NS',         'ABB India Ltd.',                                 'EQUITY', 'Capital Goods', 'NSE'),
('AIAENG.NS',      'AIA Engineering Ltd.',                           'EQUITY', 'Capital Goods', 'NSE'),
('APLAPOLLO.NS',   'APL Apollo Tubes Ltd.',                          'EQUITY', 'Capital Goods', 'NSE'),
('APARINDS.NS',    'Apar Industries Ltd.',                           'EQUITY', 'Capital Goods', 'NSE'),
('ASHOKLEY.NS',    'Ashok Leyland Ltd.',                             'EQUITY', 'Capital Goods', 'NSE'),
('ASTRAL.NS',      'Astral Ltd.',                                    'EQUITY', 'Capital Goods', 'NSE'),
('BDL.NS',         'Bharat Dynamics Ltd.',                           'EQUITY', 'Capital Goods', 'NSE'),
('BEL.NS',         'Bharat Electronics Ltd.',                        'EQUITY', 'Capital Goods', 'NSE'),
('BHEL.NS',        'Bharat Heavy Electricals Ltd.',                  'EQUITY', 'Capital Goods', 'NSE'),
('CGPOWER.NS',     'CG Power and Industrial Solutions Ltd.',         'EQUITY', 'Capital Goods', 'NSE'),
('COCHINSHIP.NS',  'Cochin Shipyard Ltd.',                           'EQUITY', 'Capital Goods', 'NSE'),
('CUMMINSIND.NS',  'Cummins India Ltd.',                             'EQUITY', 'Capital Goods', 'NSE'),
('ENRIN.NS',       'Siemens Energy India Ltd.',                      'EQUITY', 'Capital Goods', 'NSE'),
('GVT&D.NS',       'GE Vernova T&D India Ltd.',                      'EQUITY', 'Capital Goods', 'NSE'),
('HAL.NS',         'Hindustan Aeronautics Ltd.',                     'EQUITY', 'Capital Goods', 'NSE'),
('HONAUT.NS',      'Honeywell Automation India Ltd.',                'EQUITY', 'Capital Goods', 'NSE'),
('KEI.NS',         'KEI Industries Ltd.',                            'EQUITY', 'Capital Goods', 'NSE'),
('MAZDOCK.NS',     'Mazagoan Dock Shipbuilders Ltd.',                'EQUITY', 'Capital Goods', 'NSE'),
('POLYCAB.NS',     'Polycab India Ltd.',                             'EQUITY', 'Capital Goods', 'NSE'),
('POWERINDIA.NS',  'Hitachi Energy India Ltd.',                      'EQUITY', 'Capital Goods', 'NSE'),
('PREMIERENE.NS',  'Premier Energies Ltd.',                          'EQUITY', 'Capital Goods', 'NSE'),
('SIEMENS.NS',     'Siemens Ltd.',                                   'EQUITY', 'Capital Goods', 'NSE'),
('SUPREMEIND.NS',  'Supreme Industries Ltd.',                        'EQUITY', 'Capital Goods', 'NSE'),
('SUZLON.NS',      'Suzlon Energy Ltd.',                             'EQUITY', 'Capital Goods', 'NSE'),
('THERMAX.NS',     'Thermax Ltd.',                                   'EQUITY', 'Capital Goods', 'NSE'),
('WAAREEENER.NS',  'Waaree Energies Ltd.',                           'EQUITY', 'Capital Goods', 'NSE'),

-- Chemicals
('COROMANDEL.NS',  'Coromandel International Ltd.',                  'EQUITY', 'Chemicals', 'NSE'),
('DEEPAKNTR.NS',   'Deepak Nitrite Ltd.',                            'EQUITY', 'Chemicals', 'NSE'),
('FACT.NS',        'Fertilisers and Chemicals Travancore Ltd.',      'EQUITY', 'Chemicals', 'NSE'),
('FLUOROCHEM.NS',  'Gujarat Fluorochemicals Ltd.',                   'EQUITY', 'Chemicals', 'NSE'),
('LINDEINDIA.NS',  'Linde India Ltd.',                               'EQUITY', 'Chemicals', 'NSE'),
('PIIND.NS',       'PI Industries Ltd.',                             'EQUITY', 'Chemicals', 'NSE'),
('PIDILITIND.NS',  'Pidilite Industries Ltd.',                       'EQUITY', 'Chemicals', 'NSE'),
('SOLARINDS.NS',   'Solar Industries India Ltd.',                    'EQUITY', 'Chemicals', 'NSE'),
('SRF.NS',         'SRF Ltd.',                                       'EQUITY', 'Chemicals', 'NSE'),
('UPL.NS',         'UPL Ltd.',                                       'EQUITY', 'Chemicals', 'NSE'),

-- Construction
('IRB.NS',         'IRB Infrastructure Developers Ltd.',             'EQUITY', 'Construction', 'NSE'),
('LT.NS',          'Larsen & Toubro Ltd.',                           'EQUITY', 'Construction', 'NSE'),
('RVNL.NS',        'Rail Vikas Nigam Ltd.',                          'EQUITY', 'Construction', 'NSE'),

-- Construction Materials
('ACC.NS',         'ACC Ltd.',                                       'EQUITY', 'Construction Materials', 'NSE'),
('AMBUJACEM.NS',   'Ambuja Cements Ltd.',                            'EQUITY', 'Construction Materials', 'NSE'),
('DALBHARAT.NS',   'Dalmia Bharat Ltd.',                             'EQUITY', 'Construction Materials', 'NSE'),
('GRASIM.NS',      'Grasim Industries Ltd.',                         'EQUITY', 'Construction Materials', 'NSE'),
('JKCEMENT.NS',    'J.K. Cement Ltd.',                               'EQUITY', 'Construction Materials', 'NSE'),
('SHREECEM.NS',    'Shree Cement Ltd.',                              'EQUITY', 'Construction Materials', 'NSE'),
('ULTRACEMCO.NS',  'UltraTech Cement Ltd.',                          'EQUITY', 'Construction Materials', 'NSE'),

-- Consumer Durables
('ASIANPAINT.NS',  'Asian Paints Ltd.',                              'EQUITY', 'Consumer Durables', 'NSE'),
('BERGEPAINT.NS',  'Berger Paints India Ltd.',                       'EQUITY', 'Consumer Durables', 'NSE'),
('BLUESTARCO.NS',  'Blue Star Ltd.',                                 'EQUITY', 'Consumer Durables', 'NSE'),
('DIXON.NS',       'Dixon Technologies (India) Ltd.',                'EQUITY', 'Consumer Durables', 'NSE'),
('HAVELLS.NS',     'Havells India Ltd.',                             'EQUITY', 'Consumer Durables', 'NSE'),
('KALYANKJIL.NS',  'Kalyan Jewellers India Ltd.',                    'EQUITY', 'Consumer Durables', 'NSE'),
('TITAN.NS',       'Titan Company Ltd.',                             'EQUITY', 'Consumer Durables', 'NSE'),
('VOLTAS.NS',      'Voltas Ltd.',                                    'EQUITY', 'Consumer Durables', 'NSE'),

-- Consumer Services
('DMART.NS',       'Avenue Supermarts Ltd.',                         'EQUITY', 'Consumer Services', 'NSE'),
('ETERNAL.NS',     'Eternal Ltd.',                                   'EQUITY', 'Consumer Services', 'NSE'),
('INDHOTEL.NS',    'Indian Hotels Co. Ltd.',                         'EQUITY', 'Consumer Services', 'NSE'),
('IRCTC.NS',       'Indian Railway Catering And Tourism Corp. Ltd.', 'EQUITY', 'Consumer Services', 'NSE'),
('ITCHOTELS.NS',   'ITC Hotels Ltd.',                                'EQUITY', 'Consumer Services', 'NSE'),
('JUBLFOOD.NS',    'Jubilant Foodworks Ltd.',                        'EQUITY', 'Consumer Services', 'NSE'),
('NAUKRI.NS',      'Info Edge (India) Ltd.',                         'EQUITY', 'Consumer Services', 'NSE'),
('NYKAA.NS',       'FSN E-Commerce Ventures Ltd.',                   'EQUITY', 'Consumer Services', 'NSE'),
('SWIGGY.NS',      'Swiggy Ltd.',                                    'EQUITY', 'Consumer Services', 'NSE'),
('TRENT.NS',       'Trent Ltd.',                                     'EQUITY', 'Consumer Services', 'NSE'),
('VMM.NS',         'Vishal Mega Mart Ltd.',                          'EQUITY', 'Consumer Services', 'NSE'),

-- Diversified
('3MINDIA.NS',     '3M India Ltd.',                                  'EQUITY', 'Diversified', 'NSE'),
('GODREJIND.NS',   'Godrej Industries Ltd.',                         'EQUITY', 'Diversified', 'NSE'),

-- Fast Moving Consumer Goods
('AWL.NS',         'AWL Agri Business Ltd.',                         'EQUITY', 'FMCG', 'NSE'),
('BRITANNIA.NS',   'Britannia Industries Ltd.',                      'EQUITY', 'FMCG', 'NSE'),
('COLPAL.NS',      'Colgate Palmolive (India) Ltd.',                 'EQUITY', 'FMCG', 'NSE'),
('DABUR.NS',       'Dabur India Ltd.',                               'EQUITY', 'FMCG', 'NSE'),
('GODREJCP.NS',    'Godrej Consumer Products Ltd.',                  'EQUITY', 'FMCG', 'NSE'),
('GODFRYPHLP.NS',  'Godfrey Phillips India Ltd.',                    'EQUITY', 'FMCG', 'NSE'),
('HINDUNILVR.NS',  'Hindustan Unilever Ltd.',                        'EQUITY', 'FMCG', 'NSE'),
('ITC.NS',         'ITC Ltd.',                                       'EQUITY', 'FMCG', 'NSE'),
('MARICO.NS',      'Marico Ltd.',                                    'EQUITY', 'FMCG', 'NSE'),
('NESTLEIND.NS',   'Nestle India Ltd.',                              'EQUITY', 'FMCG', 'NSE'),
('PATANJALI.NS',   'Patanjali Foods Ltd.',                           'EQUITY', 'FMCG', 'NSE'),
('PGHH.NS',        'Procter & Gamble Hygiene & Health Care Ltd.',    'EQUITY', 'FMCG', 'NSE'),
('TATACONSUM.NS',  'Tata Consumer Products Ltd.',                    'EQUITY', 'FMCG', 'NSE'),
('UBL.NS',         'United Breweries Ltd.',                          'EQUITY', 'FMCG', 'NSE'),
('UNITDSPR.NS',    'United Spirits Ltd.',                            'EQUITY', 'FMCG', 'NSE'),
('VBL.NS',         'Varun Beverages Ltd.',                           'EQUITY', 'FMCG', 'NSE'),

-- Financial Services
('360ONE.NS',      '360 ONE WAM Ltd.',                               'EQUITY', 'Financial Services', 'NSE'),
('ABCAPITAL.NS',   'Aditya Birla Capital Ltd.',                      'EQUITY', 'Financial Services', 'NSE'),
('AUBANK.NS',      'AU Small Finance Bank Ltd.',                     'EQUITY', 'Financial Services', 'NSE'),
('AXISBANK.NS',    'Axis Bank Ltd.',                                 'EQUITY', 'Financial Services', 'NSE'),
('BAJFINANCE.NS',  'Bajaj Finance Ltd.',                             'EQUITY', 'Financial Services', 'NSE'),
('BAJAJFINSV.NS',  'Bajaj Finserv Ltd.',                             'EQUITY', 'Financial Services', 'NSE'),
('BAJAJHLDNG.NS',  'Bajaj Holdings & Investment Ltd.',               'EQUITY', 'Financial Services', 'NSE'),
('BAJAJHFL.NS',    'Bajaj Housing Finance Ltd.',                     'EQUITY', 'Financial Services', 'NSE'),
('BANKINDIA.NS',   'Bank of India',                                  'EQUITY', 'Financial Services', 'NSE'),
('BANKBARODA.NS',  'Bank of Baroda',                                 'EQUITY', 'Financial Services', 'NSE'),
('BSE.NS',         'BSE Ltd.',                                       'EQUITY', 'Financial Services', 'NSE'),
('CANBK.NS',       'Canara Bank',                                    'EQUITY', 'Financial Services', 'NSE'),
('CHOLAFIN.NS',    'Cholamandalam Investment and Finance Co. Ltd.',  'EQUITY', 'Financial Services', 'NSE'),
('CRISIL.NS',      'CRISIL Ltd.',                                    'EQUITY', 'Financial Services', 'NSE'),
('FEDERALBNK.NS',  'Federal Bank Ltd.',                              'EQUITY', 'Financial Services', 'NSE'),
('GICRE.NS',       'General Insurance Corporation of India',         'EQUITY', 'Financial Services', 'NSE'),
('HDFCAMC.NS',     'HDFC Asset Management Company Ltd.',             'EQUITY', 'Financial Services', 'NSE'),
('HDFCBANK.NS',    'HDFC Bank Ltd.',                                 'EQUITY', 'Financial Services', 'NSE'),
('HDFCLIFE.NS',    'HDFC Life Insurance Company Ltd.',               'EQUITY', 'Financial Services', 'NSE'),
('HUDCO.NS',       'Housing & Urban Development Corporation Ltd.',   'EQUITY', 'Financial Services', 'NSE'),
('ICICIBANK.NS',   'ICICI Bank Ltd.',                                'EQUITY', 'Financial Services', 'NSE'),
('ICICIGI.NS',     'ICICI Lombard General Insurance Co. Ltd.',       'EQUITY', 'Financial Services', 'NSE'),
('ICICIPRULI.NS',  'ICICI Prudential Life Insurance Co. Ltd.',       'EQUITY', 'Financial Services', 'NSE'),
('IDBI.NS',        'IDBI Bank Ltd.',                                 'EQUITY', 'Financial Services', 'NSE'),
('IDFCFIRSTB.NS',  'IDFC First Bank Ltd.',                           'EQUITY', 'Financial Services', 'NSE'),
('INDIANB.NS',     'Indian Bank',                                    'EQUITY', 'Financial Services', 'NSE'),
('INDUSINDBK.NS',  'IndusInd Bank Ltd.',                             'EQUITY', 'Financial Services', 'NSE'),
('IOB.NS',         'Indian Overseas Bank',                           'EQUITY', 'Financial Services', 'NSE'),
('IREDA.NS',       'Indian Renewable Energy Development Agency Ltd.','EQUITY', 'Financial Services', 'NSE'),
('IRFC.NS',        'Indian Railway Finance Corporation Ltd.',        'EQUITY', 'Financial Services', 'NSE'),
('JIOFIN.NS',      'Jio Financial Services Ltd.',                    'EQUITY', 'Financial Services', 'NSE'),
('KOTAKBANK.NS',   'Kotak Mahindra Bank Ltd.',                       'EQUITY', 'Financial Services', 'NSE'),
('LTF.NS',         'L&T Finance Ltd.',                               'EQUITY', 'Financial Services', 'NSE'),
('LICHSGFIN.NS',   'LIC Housing Finance Ltd.',                       'EQUITY', 'Financial Services', 'NSE'),
('LICI.NS',        'Life Insurance Corporation of India',            'EQUITY', 'Financial Services', 'NSE'),
('M&MFIN.NS',      'Mahindra & Mahindra Financial Services Ltd.',    'EQUITY', 'Financial Services', 'NSE'),
('MAHABANK.NS',    'Bank of Maharashtra',                            'EQUITY', 'Financial Services', 'NSE'),
('MFSL.NS',        'Max Financial Services Ltd.',                    'EQUITY', 'Financial Services', 'NSE'),
('MOTILALOFS.NS',  'Motilal Oswal Financial Services Ltd.',          'EQUITY', 'Financial Services', 'NSE'),
('MUTHOOTFIN.NS',  'Muthoot Finance Ltd.',                           'EQUITY', 'Financial Services', 'NSE'),
('NAM-INDIA.NS',   'Nippon Life India Asset Management Ltd.',        'EQUITY', 'Financial Services', 'NSE'),
('NIACL.NS',       'The New India Assurance Company Ltd.',           'EQUITY', 'Financial Services', 'NSE'),
('PAYTM.NS',       'One 97 Communications Ltd.',                     'EQUITY', 'Financial Services', 'NSE'),
('PFC.NS',         'Power Finance Corporation Ltd.',                 'EQUITY', 'Financial Services', 'NSE'),
('PNB.NS',         'Punjab National Bank',                           'EQUITY', 'Financial Services', 'NSE'),
('POLICYBZR.NS',   'PB Fintech Ltd.',                                'EQUITY', 'Financial Services', 'NSE'),
('RECLTD.NS',      'REC Ltd.',                                       'EQUITY', 'Financial Services', 'NSE'),
('SBICARD.NS',     'SBI Cards and Payment Services Ltd.',            'EQUITY', 'Financial Services', 'NSE'),
('SBILIFE.NS',     'SBI Life Insurance Company Ltd.',                'EQUITY', 'Financial Services', 'NSE'),
('SBIN.NS',        'State Bank of India',                            'EQUITY', 'Financial Services', 'NSE'),
('SHRIRAMFIN.NS',  'Shriram Finance Ltd.',                           'EQUITY', 'Financial Services', 'NSE'),
('SUNDARMFIN.NS',  'Sundaram Finance Ltd.',                          'EQUITY', 'Financial Services', 'NSE'),
('TATAINVEST.NS',  'Tata Investment Corporation Ltd.',               'EQUITY', 'Financial Services', 'NSE'),
('UCOBANK.NS',     'UCO Bank',                                       'EQUITY', 'Financial Services', 'NSE'),
('UNIONBANK.NS',   'Union Bank of India',                            'EQUITY', 'Financial Services', 'NSE'),
('YESBANK.NS',     'Yes Bank Ltd.',                                  'EQUITY', 'Financial Services', 'NSE'),

-- Healthcare
('ABBOTINDIA.NS',  'Abbott India Ltd.',                              'EQUITY', 'Healthcare', 'NSE'),
('AJANTPHARM.NS',  'Ajanta Pharmaceuticals Ltd.',                    'EQUITY', 'Healthcare', 'NSE'),
('ALKEM.NS',       'Alkem Laboratories Ltd.',                        'EQUITY', 'Healthcare', 'NSE'),
('APOLLOHOSP.NS',  'Apollo Hospitals Enterprise Ltd.',               'EQUITY', 'Healthcare', 'NSE'),
('AUROPHARMA.NS',  'Aurobindo Pharma Ltd.',                          'EQUITY', 'Healthcare', 'NSE'),
('BIOCON.NS',      'Biocon Ltd.',                                    'EQUITY', 'Healthcare', 'NSE'),
('CIPLA.NS',       'Cipla Ltd.',                                     'EQUITY', 'Healthcare', 'NSE'),
('DIVISLAB.NS',    'Divi''s Laboratories Ltd.',                      'EQUITY', 'Healthcare', 'NSE'),
('DRREDDY.NS',     'Dr. Reddy''s Laboratories Ltd.',                 'EQUITY', 'Healthcare', 'NSE'),
('FORTIS.NS',      'Fortis Healthcare Ltd.',                         'EQUITY', 'Healthcare', 'NSE'),
('GLAXO.NS',       'Glaxosmithkline Pharmaceuticals Ltd.',           'EQUITY', 'Healthcare', 'NSE'),
('GLENMARK.NS',    'Glenmark Pharmaceuticals Ltd.',                  'EQUITY', 'Healthcare', 'NSE'),
('IPCALAB.NS',     'Ipca Laboratories Ltd.',                         'EQUITY', 'Healthcare', 'NSE'),
('LUPIN.NS',       'Lupin Ltd.',                                     'EQUITY', 'Healthcare', 'NSE'),
('MANKIND.NS',     'Mankind Pharma Ltd.',                            'EQUITY', 'Healthcare', 'NSE'),
('MAXHEALTH.NS',   'Max Healthcare Institute Ltd.',                  'EQUITY', 'Healthcare', 'NSE'),
('MEDANTA.NS',     'Global Health Ltd.',                             'EQUITY', 'Healthcare', 'NSE'),
('SUNPHARMA.NS',   'Sun Pharmaceutical Industries Ltd.',             'EQUITY', 'Healthcare', 'NSE'),
('SYNGENE.NS',     'Syngene International Ltd.',                     'EQUITY', 'Healthcare', 'NSE'),
('TORNTPHARM.NS',  'Torrent Pharmaceuticals Ltd.',                   'EQUITY', 'Healthcare', 'NSE'),
('ZYDUSLIFE.NS',   'Zydus Lifesciences Ltd.',                        'EQUITY', 'Healthcare', 'NSE'),

-- Information Technology
('COFORGE.NS',     'Coforge Ltd.',                                   'EQUITY', 'Information Technology', 'NSE'),
('HCLTECH.NS',     'HCL Technologies Ltd.',                          'EQUITY', 'Information Technology', 'NSE'),
('HEXT.NS',        'Hexaware Technologies Ltd.',                     'EQUITY', 'Information Technology', 'NSE'),
('INFY.NS',        'Infosys Ltd.',                                   'EQUITY', 'Information Technology', 'NSE'),
('KPITTECH.NS',    'KPIT Technologies Ltd.',                         'EQUITY', 'Information Technology', 'NSE'),
('LTM.NS',         'LTIMindtree Ltd.',                               'EQUITY', 'Information Technology', 'NSE'),
('LTTS.NS',        'L&T Technology Services Ltd.',                   'EQUITY', 'Information Technology', 'NSE'),
('MPHASIS.NS',     'MphasiS Ltd.',                                   'EQUITY', 'Information Technology', 'NSE'),
('OFSS.NS',        'Oracle Financial Services Software Ltd.',        'EQUITY', 'Information Technology', 'NSE'),
('PERSISTENT.NS',  'Persistent Systems Ltd.',                        'EQUITY', 'Information Technology', 'NSE'),
('TCS.NS',         'Tata Consultancy Services Ltd.',                 'EQUITY', 'Information Technology', 'NSE'),
('TATAELXSI.NS',   'Tata Elxsi Ltd.',                                'EQUITY', 'Information Technology', 'NSE'),
('TATATECH.NS',    'Tata Technologies Ltd.',                         'EQUITY', 'Information Technology', 'NSE'),
('TECHM.NS',       'Tech Mahindra Ltd.',                             'EQUITY', 'Information Technology', 'NSE'),
('WIPRO.NS',       'Wipro Ltd.',                                     'EQUITY', 'Information Technology', 'NSE'),

-- Metals & Mining
('ADANIENT.NS',    'Adani Enterprises Ltd.',                         'EQUITY', 'Metals & Mining', 'NSE'),
('HINDALCO.NS',    'Hindalco Industries Ltd.',                       'EQUITY', 'Metals & Mining', 'NSE'),
('HINDZINC.NS',    'Hindustan Zinc Ltd.',                            'EQUITY', 'Metals & Mining', 'NSE'),
('JINDALSTEL.NS',  'Jindal Steel Ltd.',                              'EQUITY', 'Metals & Mining', 'NSE'),
('JSL.NS',         'Jindal Stainless Ltd.',                          'EQUITY', 'Metals & Mining', 'NSE'),
('JSWSTEEL.NS',    'JSW Steel Ltd.',                                 'EQUITY', 'Metals & Mining', 'NSE'),
('LLOYDSME.NS',    'Lloyds Metals And Energy Ltd.',                  'EQUITY', 'Metals & Mining', 'NSE'),
('NATIONALUM.NS',  'National Aluminium Co. Ltd.',                    'EQUITY', 'Metals & Mining', 'NSE'),
('NMDC.NS',        'NMDC Ltd.',                                      'EQUITY', 'Metals & Mining', 'NSE'),
('SAIL.NS',        'Steel Authority of India Ltd.',                  'EQUITY', 'Metals & Mining', 'NSE'),
('TATASTEEL.NS',   'Tata Steel Ltd.',                                'EQUITY', 'Metals & Mining', 'NSE'),
('VEDL.NS',        'Vedanta Ltd.',                                   'EQUITY', 'Metals & Mining', 'NSE'),

-- Oil, Gas & Consumable Fuels
('ATGL.NS',        'Adani Total Gas Ltd.',                           'EQUITY', 'Oil Gas & Consumable Fuels', 'NSE'),
('BPCL.NS',        'Bharat Petroleum Corporation Ltd.',              'EQUITY', 'Oil Gas & Consumable Fuels', 'NSE'),
('COALINDIA.NS',   'Coal India Ltd.',                                'EQUITY', 'Oil Gas & Consumable Fuels', 'NSE'),
('GAIL.NS',        'GAIL (India) Ltd.',                              'EQUITY', 'Oil Gas & Consumable Fuels', 'NSE'),
('GUJGASLTD.NS',   'Gujarat Gas Ltd.',                               'EQUITY', 'Oil Gas & Consumable Fuels', 'NSE'),
('HINDPETRO.NS',   'Hindustan Petroleum Corporation Ltd.',           'EQUITY', 'Oil Gas & Consumable Fuels', 'NSE'),
('IGL.NS',         'Indraprastha Gas Ltd.',                          'EQUITY', 'Oil Gas & Consumable Fuels', 'NSE'),
('IOC.NS',         'Indian Oil Corporation Ltd.',                    'EQUITY', 'Oil Gas & Consumable Fuels', 'NSE'),
('OIL.NS',         'Oil India Ltd.',                                 'EQUITY', 'Oil Gas & Consumable Fuels', 'NSE'),
('ONGC.NS',        'Oil & Natural Gas Corporation Ltd.',             'EQUITY', 'Oil Gas & Consumable Fuels', 'NSE'),
('PETRONET.NS',    'Petronet LNG Ltd.',                              'EQUITY', 'Oil Gas & Consumable Fuels', 'NSE'),
('RELIANCE.NS',    'Reliance Industries Ltd.',                       'EQUITY', 'Oil Gas & Consumable Fuels', 'NSE'),

-- Power
('ADANIENSOL.NS',  'Adani Energy Solutions Ltd.',                    'EQUITY', 'Power', 'NSE'),
('ADANIGREEN.NS',  'Adani Green Energy Ltd.',                        'EQUITY', 'Power', 'NSE'),
('ADANIPOWER.NS',  'Adani Power Ltd.',                               'EQUITY', 'Power', 'NSE'),
('JSWENERGY.NS',   'JSW Energy Ltd.',                                'EQUITY', 'Power', 'NSE'),
('NHPC.NS',        'NHPC Ltd.',                                      'EQUITY', 'Power', 'NSE'),
('NLCINDIA.NS',    'NLC India Ltd.',                                 'EQUITY', 'Power', 'NSE'),
('NTPC.NS',        'NTPC Ltd.',                                      'EQUITY', 'Power', 'NSE'),
('NTPCGREEN.NS',   'NTPC Green Energy Ltd.',                         'EQUITY', 'Power', 'NSE'),
('POWERGRID.NS',   'Power Grid Corporation of India Ltd.',           'EQUITY', 'Power', 'NSE'),
('SJVN.NS',        'SJVN Ltd.',                                      'EQUITY', 'Power', 'NSE'),
('TATAPOWER.NS',   'Tata Power Co. Ltd.',                            'EQUITY', 'Power', 'NSE'),
('TORNTPOWER.NS',  'Torrent Power Ltd.',                             'EQUITY', 'Power', 'NSE'),

-- Realty
('DLF.NS',         'DLF Ltd.',                                       'EQUITY', 'Realty', 'NSE'),
('GODREJPROP.NS',  'Godrej Properties Ltd.',                         'EQUITY', 'Realty', 'NSE'),
('LODHA.NS',       'Lodha Developers Ltd.',                          'EQUITY', 'Realty', 'NSE'),
('OBEROIRLTY.NS',  'Oberoi Realty Ltd.',                             'EQUITY', 'Realty', 'NSE'),
('PHOENIXLTD.NS',  'Phoenix Mills Ltd.',                             'EQUITY', 'Realty', 'NSE'),
('PRESTIGE.NS',    'Prestige Estates Projects Ltd.',                 'EQUITY', 'Realty', 'NSE'),

-- Services
('ADANIPORTS.NS',  'Adani Ports and Special Economic Zone Ltd.',     'EQUITY', 'Services', 'NSE'),
('CONCOR.NS',      'Container Corporation of India Ltd.',            'EQUITY', 'Services', 'NSE'),
('GMRAIRPORT.NS',  'GMR Airports Ltd.',                              'EQUITY', 'Services', 'NSE'),
('INDIGO.NS',      'InterGlobe Aviation Ltd.',                       'EQUITY', 'Services', 'NSE'),
('JSWINFRA.NS',    'JSW Infrastructure Ltd.',                        'EQUITY', 'Services', 'NSE'),

-- Telecommunication
('BHARTIARTL.NS',  'Bharti Airtel Ltd.',                             'EQUITY', 'Telecommunication', 'NSE'),
('BHARTIHEXA.NS',  'Bharti Hexacom Ltd.',                            'EQUITY', 'Telecommunication', 'NSE'),
('IDEA.NS',        'Vodafone Idea Ltd.',                             'EQUITY', 'Telecommunication', 'NSE'),
('INDUSTOWER.NS',  'Indus Towers Ltd.',                              'EQUITY', 'Telecommunication', 'NSE'),
('TATACOMM.NS',    'Tata Communications Ltd.',                       'EQUITY', 'Telecommunication', 'NSE'),

-- Textiles
('KPRMILL.NS',     'K.P.R. Mill Ltd.',                               'EQUITY', 'Textiles', 'NSE'),
('PAGEIND.NS',     'Page Industries Ltd.',                           'EQUITY', 'Textiles', 'NSE'),

-- ============================================================
-- TOP NSE ETFs (by AUM / trading volume)
-- ============================================================

-- Broad Market — NIFTY 50
('NIFTYBEES.NS',   'Nippon India ETF Nifty BeES',                   'ETF', 'Broad Market', 'NSE'),
('SETFNIF50.NS',   'SBI ETF Nifty 50',                              'ETF', 'Broad Market', 'NSE'),
('NIFTYIETF.NS',   'ICICI Pru Nifty ETF',                           'ETF', 'Broad Market', 'NSE'),
('NIFTY1.NS',      'Kotak Nifty ETF',                                'ETF', 'Broad Market', 'NSE'),

-- NIFTY Next 50 / 100
('JUNIORBEES.NS',  'Nippon India ETF Nifty Next 50 Junior BeES',    'ETF', 'Broad Market', 'NSE'),
('NIF100BEES.NS',  'Nippon India ETF Nifty 100',                    'ETF', 'Broad Market', 'NSE'),
('NIF100IETF.NS',  'ICICI Pru Nifty 100 ETF',                       'ETF', 'Broad Market', 'NSE'),

-- Midcap
('MID150BEES.NS',  'Nippon India ETF Midcap 150',                   'ETF', 'Midcap', 'NSE'),
('MIDCAPIETF.NS',  'ICICI Pru Midcap 150 ETF',                      'ETF', 'Midcap', 'NSE'),

-- Banking
('BANKBEES.NS',    'Nippon India ETF Bank BeES',                     'ETF', 'Banking', 'NSE'),
('BANKIETF.NS',    'ICICI Pru Nifty Bank ETF',                       'ETF', 'Banking', 'NSE'),
('HDFCNIFBAN.NS',  'HDFC Nifty Bank ETF',                           'ETF', 'Banking', 'NSE'),
('PSUBNKBEES.NS',  'Nippon India ETF PSU Bank BeES',                'ETF', 'PSU Banking', 'NSE'),

-- IT
('ITBEES.NS',      'Nippon India ETF Nifty IT',                      'ETF', 'Information Technology', 'NSE'),

-- Gold
('GOLDBEES.NS',    'Nippon India ETF Gold BeES',                    'ETF', 'Gold', 'NSE'),
('SETFGOLD.NS',    'SBI ETF Gold',                                   'ETF', 'Gold', 'NSE'),
('HDFCGOLD.NS',    'HDFC Gold ETF',                                  'ETF', 'Gold', 'NSE'),

-- PSU / CPSE
('CPSEETF.NS',     'CPSE ETF',                                       'ETF', 'PSU / CPSE', 'NSE')

ON CONFLICT (symbol) DO NOTHING;
