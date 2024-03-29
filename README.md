# E-commerce System Design
Inherited a front-end e-commerce application, and built and optimized the backend API to store and serve the reviews data for the products on the website. I worked with over 12 million data entries regarding reviews for products.
## Tech Stack
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
### Testing
[Loader.io](https://loader.io/)
</br>
[k6](https://k6.io/docs/)

## Project Description
### Goal
| Throughput|  Latency  | Error rate|
|-----------|-----------|-----------|
| 1,000 rps |  <= 50ms  |   < 1%    |

### Data Transfer
The questions and answers data has over 12 million data entries. I transferred the data from a csv file into a postgreSQL database by performing an ETL process.

### Deployment
Deployed the server and database to AWS, I used a EC2 T2 micro instance for my server. I stress tested using Loader.io, and took the average of three test with randomized product ID.
| Throughput|  Latency  | Error rate|
|-----------|-----------|-----------|
| 1,000 rps |  83ms     |    0%     |

### Load Balancer
I scaled horizontally and deployed another server. Then, I used Nginx as my load balancer. Interestingly this increased my error rate, so I needed to do further research and optimization.
| Throughput|  Latency  | Error rate|
|-----------|-----------|-----------|
| 1,000 rps |   243ms   |     51%   |

### Least Connection
To fix the error problem above I switched to least connection load balancing from round robin load balancing in Nginx. This brought down both my error rate and my latency speed. I still had not reached my goal however, so there was more work to be done.
| Throughput|  Latency  | Error rate|
|-----------|-----------|-----------|
| 1,000 rps |    83ms    |     0.1% |

### Content Caching
Performed content caching in load balancer.
| Throughput|  Latency  | Error rate|
|-----------|-----------|-----------|
| 1,000 rps |   61ms    |   0%      |

### Location of Server
To get my latency speed even lower, I evaluated where my testing client (Loader.io) was located and re-deployed my AWS EC2 microinstances in the location of the client.
| Throughput|  Latency  | Error rate|
|-----------|-----------|-----------|
| 1,000 rps |   1ms    |   0%      |

### Final Result
Increased throughput to 6,000 rps.
| Throughput|  Latency  | Error rate|
|-----------|-----------|-----------|
| 6,000 rps |    3ms    |     0%    |

## Installation and Usage
Ensure postgreSQL is installed in your computer
</br>
Copy `example.env` file and rename to `.env`, then fill in the variables
```
npm install
```
```
npm run server-dev
```
