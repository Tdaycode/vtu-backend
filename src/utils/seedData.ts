import { ProductIDs, ProductTypes, Providers, ServiceFeeAmountType, ServiceTypes } from './../interfaces/product.interface';
import { KYCLevels } from '../interfaces/kyc.interface';
import { IPaymentMethod, PaymentTypes } from '../interfaces/payment.interface';
import { ISettings, SettingsType } from '../interfaces/settings.interface';
import { AccountType, IAdminUser } from '../interfaces/user.interface';

export const kycLevelsData = [
    {
        level: KYCLevels.Level_1,
        dailyLimit: "100",
        monthlyLimit: "1000",
        baseCurrency: "USD"
    },
    {
        level: KYCLevels.Level_2,
        dailyLimit: "5000",
        monthlyLimit: "50000",
        baseCurrency: "USD"
    },
    {
        level: KYCLevels.Level_3,
        dailyLimit: "10000",
        monthlyLimit: "unlimited",
        baseCurrency: "USD",
    },
]

export const categoriesData = [
    {
        name: "Airtime",
        description: "Airtime Category",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI4Mzc0MDI0Ni00N2NlLTRiZWYtYTU0ZS04NTU0YzBiMzM2MTIucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjpudWxsLCJoZWlnaHQiOm51bGwsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19"
    },
    {
        name: "Data",
        description: "Data Category",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI4Mzc0MDI0Ni00N2NlLTRiZWYtYTU0ZS04NTU0YzBiMzM2MTIucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjpudWxsLCJoZWlnaHQiOm51bGwsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19"
    },
    {
        name: "Electricity",
        description: "Electricity Category",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJlOWVlMWM0MC1iODFjLTQ5ZjQtODdmZC04YWIwNmY1YmExZTUucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjpudWxsLCJoZWlnaHQiOm51bGwsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
    },
    {
        name: "TV",
        description: "TV Category",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjNDQ3NmFhNC03YjA0LTRlZWItOTgzNy03NzYzNzk4ZWI1MjAucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjpudWxsLCJoZWlnaHQiOm51bGwsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19"
    },
    {
        name: "Betting",
        description: "Betting Category",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI2NjA3ZDczMi1hN2QwLTQzODQtYTJhOC03NmE2ODdmOGIyZWIucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjpudWxsLCJoZWlnaHQiOm51bGwsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19"
    },
    {
        name: "Internet",
        description: "Internet Category",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJlOWVlMWM0MC1iODFjLTQ5ZjQtODdmZC04YWIwNmY1YmExZTUucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjpudWxsLCJoZWlnaHQiOm51bGwsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19"
    },
    {
        name: "Gift Card",
        description: "Gift Card Category",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI0YTIxOTU0Yy0xYmJkLTQyMDAtOTVlOC00N2M0MTE4ZjcyYjYucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjpudWxsLCJoZWlnaHQiOm51bGwsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19"
    }
]; 

export const productsData = [
    {
        name: "MTN",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiIwMDcxZDFlOC1mMDYyLTQwYzktYTU5Yy00MjE2OTMxOGI0ZTYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Airtime",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Airtime,
        label: "Phone Number",
        providers:[
            {
                name: Providers.PrimeAirtime,
                active: true
            },
            {
                name: Providers.Interswitch,
                active: false,
                productId: ProductIDs.INTERSWITCH_MTN
            },
        ]
    },
    {
        name: "GLO",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI3NGYwMTEwYS1iZWZmLTQxOWMtODY4Mi1lZDk5ZjZkZGIxZjIucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Airtime",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Airtime,
        label: "Phone Number",
        providers: [
            {
                name: Providers.PrimeAirtime,
                active: true
            },
            {
                name: Providers.Interswitch,
                active: false,
                productId: ProductIDs.INTERSWITCH_GLO
            },
        ]
    },
    {
        name: "Airtel",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI0ODQ1YTEzMS02NzE4LTRlZGItYjViMi0xZDIzMzcxNzhmZTkucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Airtime",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Airtime,
        label: "Phone Number",
        providers: [
            {
                name: Providers.PrimeAirtime,
                active: true
            }
        ]
    },
    {
        name: "9mobile",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI4OTExMDk4MC1iZjY4LTRlMjYtYTk3ZS00NGFkNzEzYzUwZGQucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Airtime",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Airtime,
        label: "Phone Number",
        providers:[{
            name: Providers.PrimeAirtime,
            active: true
        }]
    },
    {
        name: "Smile Recharge",
        imageUrl: "https://one.jumia.com.ng/static-assets/operators/smile.png",
        category: "Airtime",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Airtime,
        label: "Phone Number",
        providers:[{
            name: Providers.PrimeAirtime,
            productId: ProductIDs.PRIME_AIRTIME_SMILE_RECHARGE,
            active: true
        }]
    },
    {
        name: "MTN",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiIwMDcxZDFlOC1mMDYyLTQwYzktYTU5Yy00MjE2OTMxOGI0ZTYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Data",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Data,
        label: "Phone Number",
        providers:[{
            name: Providers.PrimeAirtime,
            active: true
        }]
    },
    {
        name: "GLO",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI3NGYwMTEwYS1iZWZmLTQxOWMtODY4Mi1lZDk5ZjZkZGIxZjIucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Data",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Data,
        label: "Phone Number",
        providers:[{
            name: Providers.PrimeAirtime,
            active: true
        }]
    }, 
    {
        name: "Airtel",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI0ODQ1YTEzMS02NzE4LTRlZGItYjViMi0xZDIzMzcxNzhmZTkucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Data",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Data,
        label: "Phone Number",
        providers:[{
            name: Providers.PrimeAirtime,
            active: true
        }]
    },
    {
        name: "9mobile",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI4OTExMDk4MC1iZjY4LTRlMjYtYTk3ZS00NGFkNzEzYzUwZGQucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Data",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Data,
        label: "Phone Number",
        providers:[{
            name: Providers.PrimeAirtime,
            active: true
        }]
    },

    {
        name: "DStv",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "TV",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.TV,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.TV,
            productId: ProductIDs.PRIME_AIRTIME_DSTV,
            active: true
        }],
        label: "Smart Card Number"
    },
    {
        name: "GOtv",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJmODE3MWEwYi0wNDQxLTRiMWItOWVlNS03NzkwMWUzMjA3ZjYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "TV",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.TV,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.TV,
            productId: ProductIDs.PRIME_AIRTIME_GOTV,
            active: true
        }],
        label: "IUC Number"
    },
    {
        name: "StarTimes",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI5YzVkODM5YS0xYjE4LTQ0MzItOTEzMS00ZTEzZmMyZmZjN2YucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "TV",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.TV,
        providers:[{
            name: Providers.PrimeAirtime,
            productId: ProductIDs.PRIME_AIRTIME_STARTIMES,
            serviceId: ServiceTypes.TV,
            active: true
        }],
        label: "Smart Card Number"
    },
    {
        name: "ShowMax",
        imageUrl: "https://pay.jumia.com.ng/static-assets/images/20211206_08_16_showmax.png",
        category: "TV",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.TV,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.TV,
            productId: ProductIDs.PRIME_AIRTIME_SHOWMAX,
            active: true
        }],
        label: "Phone Number"
    },

    {
        name: "BET9JA",
        imageUrl: "https://www.quickteller.com/images/Downloaded/d46ff91c-ab12-4a55-8e50-c7bdb874a778.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.PRIME_AIRTIME_BET9JA,
            active: true
        }],
        label: "Customer ID"
    },
    {
        name: "BANGBET",
        imageUrl: "https://www.quickteller.com/images/Downloaded/e7ffffde-199b-47b1-bddf-8072bea2d5cf.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.PRIME_AIRTIME_BANGBET,
            active: true
        }],
        label: "Customer ID"
    },
    {
        name: "NAIRABET",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI1ZmM2M2MzNi0xMWYyLTQ2ZDEtODhlOC1jNzkyNmJkZmU3NTcuanBnLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjM4NH19LCJ3ZWJwIjp7fX0=",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Lottery,
                productId: ProductIDs.PRIME_AIRTIME_NAIRABET,
                active: true
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Lottery,
                productId: ProductIDs.INTERSWITCH_NAIRABET,
                active: false
            }
        ],
        label: "Customer ID"
    },
    {
        name: "SUPABET",
        imageUrl: "https://www.quickteller.com/images/Downloaded/b1a31d0e-9a9c-4ff3-9f07-1734bd84c1be.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.PRIME_AIRTIME_SUPABET,
            active: true
        }],
        label: "Customer ID"
    },
    {
        name: "1XBET",
        imageUrl: "https://www.quickteller.com/images/Downloaded/2511d486-352d-48c7-894f-9697422227b2.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.PRIME_AIRTIME_1XBET,
            active: true
        }],
        label: "Customer ID"
    },
    {
        name: "MERRYBET",
        imageUrl: "https://www.quickteller.com/images/Downloaded/5bed6c94-2e8b-4051-b5a8-e8581b1bcea5.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.PRIME_AIRTIME_MERRYBET,
            active: true
        }],
        label: "Customer ID"
    },
    {
        name: "BETLION",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJkMmI5YWY5MS05MDY0LTQ0ZjgtYmI2Yy1kZGMyOGU3ZTI0YTQuanBnLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjM4NDB9fSwid2VicCI6e319",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.PRIME_AIRTIME_BETLION,
            active: true
        }],
        label: "Customer ID"
    },
    {
        name: "BETWAY",
        imageUrl: "https://www.quickteller.com/images/Downloaded/b1bb30ed-6cb0-4d1d-b92a-d54652efeda7.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.PRIME_AIRTIME_BETWAY,
            active: true
        }],
        label: "Customer ID"
    },
    {
        name: "LIVESCOREBET",
        imageUrl: "https://www.quickteller.com/images/Downloaded/6962bd1c-b784-4033-9f24-2692f6cdeff2.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.PRIME_AIRTIME_LIVESCOREBET,
            active: true,
        }],
        label: "Customer ID"
    },
    {
        name: "CLOUDBET",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJlMTA3MDI1Yy0xZWI3LTQwZjAtODE0OS01NDRkNmFiOTY3ZjQuanBnLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjM4NDB9fSwid2VicCI6e319",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.PRIME_AIRTIME_CLOUDBET,
            active: true
        }],
        label: "Customer ID"
    },
    {
        name: "NAIJABET",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJlMTRiZmRmYy00OWI3LTQyNTktYjNkNi1jOThlZWQ5ZDg2MGEuanBnLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjM4NDB9fSwid2VicCI6e319",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.PRIME_AIRTIME_NAIJABET,
            active: true
        }],
        label: "Customer ID"
    },
    {
        name: "BETKING",
        imageUrl: "https://www.quickteller.com/images/Downloaded/ca8768a7-bfd4-4990-8776-eb44eeaa5ef6.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.PRIME_AIRTIME_BETKING,
            active: true
        }],
        label: "Customer ID"
    },
    {
        name: "BETLAND",
        imageUrl: "https://www.quickteller.com/images/Downloaded/ec328c0d-2b09-4748-bef8-f44047b2b798.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.PRIME_AIRTIME_BETLAND,
            active: true
        }],
        label: "Customer ID"
    },
    {
        name: "Accessbet",
        imageUrl: "https://www.quickteller.com/images/Downloaded/2640c9dd-3997-44ac-a3de-c87652a0a03e.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.Interswitch,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.INTERSWITCH_Accessbet,
            active: true
        }],
        label: "Agent ID/Customer ID"
    },
    {
        name: "22BET",
        imageUrl: "https://22bet.ng/genfiles/cms/pg/151/images/69c5fba8763e25104c4b57be540b9ec9.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.Interswitch,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.INTERSWITCH_22BET,
            active: true
        }],
        label: "CUSTOMER ID"
    },
    {
        name: "BETBIGA",
        imageUrl: "https://www.quickteller.com/images/Downloaded/3cda512d-ee73-4b63-9cfc-c982703565f1.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        providers:[{
            name: Providers.Interswitch,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.INTERSWITCH_BETBIGA,
            active: true
        }],
        label: "CUSTOMER ID"
    },
    {
        name: "BetBonanza",
        imageUrl: "https://www.quickteller.com/images/Downloaded/343767f7-f5a8-4b97-9f0f-33d145d19f0f.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        // serviceFee: {
        //     type: ServiceFeeAmountType.Flat,
        //     value: 50,
        //     active: true
        // },
        providers:[{
            name: Providers.Interswitch,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.INTERSWITCH_BetBonanza,
            active: true
        }],
        label: "Player ID/Agent ID"
    },
    {
        name: "BETFARM",
        imageUrl: "https://www.quickteller.com/images/Downloaded/ecb265d5-0804-4f0e-a0ac-783aaa0af8b0.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        // serviceFee: {
        //     type: ServiceFeeAmountType.Flat,
        //     value: 50,
        //     active: true
        // },
        providers:[{
            name: Providers.Interswitch,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.INTERSWITCH_BETFARM,
            active: true
        }],
        label: "Player ID"
    },
    {
        name: "FortuneBet",
        imageUrl: "https://www.quickteller.com/images/Downloaded/648cf5e8-cb2e-4c64-a7fd-160f0d5da052.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        // serviceFee: {
        //     type: ServiceFeeAmountType.Flat,
        //     value: 50,
        //     active: true
        // },
        providers:[{
            name: Providers.Interswitch,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.INTERSWITCH_FortuneBet,
            active: true
        }],
        label: "Payee ID"
    },
    {
        name: "Kickoff102 Bet",
        imageUrl: "https://www.quickteller.com/images/Downloaded/f4df8f6a-b926-4aba-a0fd-4ec3d091d1f4.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        // serviceFee: {
        //     type: ServiceFeeAmountType.Flat,
        //     value: 50,
        //     active: true
        // },
        providers:[{
            name: Providers.Interswitch,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.INTERSWITCH_Kickoff102Bet,
            active: true
        }],
        label: "Customer ID"
    },
    {
        name: "NETBET",
        imageUrl: "https://www.quickteller.com/images/Downloaded/6f3d4345-1160-4b87-9d62-5261ac049585.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        // serviceFee: {
        //     type: ServiceFeeAmountType.Flat,
        //     value: 50,
        //     active: true
        // },
        providers:[{
            name: Providers.Interswitch,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.INTERSWITCH_NETBET,
            active: true
        }],
        label: "ORDER ID"
    },
    {
        name: "Premier Lotto - Baba Ijebu",
        imageUrl: "https://www.quickteller.com/images/Downloaded/ce65be05-7a7b-4212-9d98-c879a4807ac0.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        // serviceFee: {
        //     type: ServiceFeeAmountType.Flat,
        //     value: 50,
        //     active: true
        // },
        providers:[{
            name: Providers.Interswitch,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.INTERSWITCH_PLOTO,
            active: true
        }],
        label: "USER ID"
    },
    {
        name: "SportyBet",
        imageUrl: "https://www.quickteller.com/images/Downloaded/ecc056dc-6fcb-4aa5-b41a-45d710d068af.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        // serviceFee: {
        //     type: ServiceFeeAmountType.Flat,
        //     value: 50,
        //     active: true
        // },
        providers:[{
            name: Providers.Interswitch,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.INTERSWITCH_SportyBet,
            active: true
        }],
        label: "Phone Number"
    },
    {
        name: "Surebet247",
        imageUrl: "https://www.quickteller.com/images/Downloaded/9b0521dc-b970-43de-a8af-c38c23a57e0b.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        // serviceFee: {
        //     type: ServiceFeeAmountType.Flat,
        //     value: 50,
        //     active: true
        // },
        providers:[{
            name: Providers.Interswitch,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.INTERSWITCH_Surebet247,
            active: true
        }],
        label: "Agent/Customer ID"
    },
    {
        name: "Winners Golden Bet",
        imageUrl: "https://www.quickteller.com/images/Downloaded/99bb3634-5185-4225-bbab-f9ee08e84f49.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        // serviceFee: {
        //     type: ServiceFeeAmountType.Flat,
        //     value: 50,
        //     active: true
        // },
        providers:[{
            name: Providers.Interswitch,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.INTERSWITCH_WGB,
            active: true
        }],
        label: "Customer ID"
    },
    {
        name: "ZEbet",
        imageUrl: "https://www.quickteller.com/images/Downloaded/2e984539-278d-47af-ba6f-690b5ee88436.png",
        category: "Betting",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Betting,
        // serviceFee: {
        //     type: ServiceFeeAmountType.Flat,
        //     value: 50,
        //     active: true
        // },
        providers:[{
            name: Providers.Interswitch,
            serviceId: ServiceTypes.Lottery,
            productId: ProductIDs.INTERSWITCH_ZEbet,
            active: true
        }],
        label: "Unique User ID"
    },
    

    {
        name: "SpectraNet",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI5ZTE4MGQzNS05MzYzLTRjZTEtOWZjNi02OTAwOTBhOTM2M2EucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Internet",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Internet,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Internet,
            productId: ProductIDs.PRIME_AIRTIME_SPECTRANET,
            active: true
        }],
        label: "Customer ID"
    },
    {
        name: "Smile",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI0NjFiZTg1YS1mZDA3LTQ0ZDctOTllNS0xNGU3MzRmNjBhNTYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Internet",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Internet,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Internet,
            productId: ProductIDs.PRIME_AIRTIME_SMILE_INTERNET,
            active: true
        }],
        label: "Customer ID"
    },

    {
        name: "Eko Electricity Prepaid",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiIzZTkzZTY3ZC01MzQ5LTRjMmItYWExNC0yYzU1YWZjZGFhZWMuanBnLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers:[
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_EKO,
                active: true
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.INTERSWITCH_EKO_PREPAID,
                active: false
            }
        ],
        label: "Meter Number"
    },
    {
        name: "Eko Electricity Postpaid",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiIzZTkzZTY3ZC01MzQ5LTRjMmItYWExNC0yYzU1YWZjZGFhZWMuanBnLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers:[
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_EKO,
                active: true
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.INTERSWITCH_EKO_POSTPAID,
                active: false
            }
        ],
        label: "Meter Number"
    },
    {
        name: "Ikeja Electricity Prepaid",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJlZTliYzIwYS1jMzJhLTRkZDgtYTA1NS1jMmFmMjRiNTY2OGUuanBnLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers: [
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_IKEJA,
                active: true
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.INTERSWITCH_IKEJA_PREPAID,
                active: false
            }
        ],
        label: "Meter Number"
    },
    {
        name: "Ikeja Electricity Postpaid",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJlZTliYzIwYS1jMzJhLTRkZDgtYTA1NS1jMmFmMjRiNTY2OGUuanBnLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers: [
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_IKEJA,
                active: true
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.INTERSWITCH_IKEJA_POSTPAID,
                active: false
            }
        ],
        label: "Meter Number"
    },
    {
        name: "IBEDC(Ibadan) Prepaid",
        imageUrl: "https://buypower.ng/static/media/Ibedc.885256cf.svg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers:[
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_IBEDC,
                active: true
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.INTERSWITCH_IBEDC_PREPAID,
                active: false
            }
        ],
        label: "Meter Number"
    },
    {
        name: "IBEDC(Ibadan) Postpaid",
        imageUrl: "https://buypower.ng/static/media/Ibedc.885256cf.svg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers:[
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_IBEDC,
                active: true
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.INTERSWITCH_IBEDC_POSTPAID,
                active: false
            }
        ],
        label: "Meter Number"
    },
    {
        name: "EEDC(Enugu) Prepaid",
        imageUrl: "https://buypower.ng/static/media/Eedc.83c6f334.svg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers:[
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_EEDC,
                active: true
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.INTERSWITCH_EEDC_PREPAID,
                active: false
            }
        ],
        label: "Meter Number"
    },
    {
        name: "EEDC(Enugu) Postpaid",
        imageUrl: "https://buypower.ng/static/media/Eedc.83c6f334.svg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers:[
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_EEDC,
                active: true
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.INTERSWITCH_EEDC_POSTPAID,
                active: false
            }
        ],
        label: "Meter Number"
    },
    {
        name: "Port Harcourt Prepaid",
        imageUrl: "https://buypower.ng/static/media/Phedc.1983fe10.svg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers:[
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_PHEDC_PREPAID,
                active: true
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.INTERSWITCH_PHEDC_PREPAID,
                active: false
            }
        ],
        label: "Meter Number"
    },
    {
        name: "Port Harcourt Postpaid",
        imageUrl: "https://buypower.ng/static/media/Phedc.1983fe10.svg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers:[
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_PHEDC_POSTPAID,
                active: true
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.INTERSWITCH_PHEDC_POSTPAID,
                active: false
            }
        ],
        label: "Meter Number"
    },
    {
        name: "Kano Prepaid",
        imageUrl: "https://buypower.ng/static/media/Kedco.d8a236b7.svg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Electricity,
            productId: ProductIDs.PRIME_AIRTIME_KANO_PREPAID,
            active: true
        }],
        label: "Meter Number"
    },
    {
        name: "Kano Postpaid",
        imageUrl: "https://buypower.ng/static/media/Kedco.d8a236b7.svg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Electricity,
            productId: ProductIDs.PRIME_AIRTIME_KANO_POSTPAID,
            active: true
        }],
        label: "Meter Number"
    },
    {
        name: "Abuja Prepaid",
        imageUrl: "https://buypower.ng/static/media/Aedc.de20ada0.svg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Electricity,
            productId: ProductIDs.PRIME_AIRTIME_ABUJA_PREPAID,
            active: true
        }],
        label: "Meter Number"
    },
    {
        name: "Abuja Postpaid",
        imageUrl: "https://buypower.ng/static/media/Aedc.de20ada0.svg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers:[{
            name: Providers.PrimeAirtime,
            serviceId: ServiceTypes.Electricity,
            productId: ProductIDs.PRIME_AIRTIME_ABUJA_POSTPAID,
            active: true
        }],
        label: "Meter Number"
    },
    {
        name: "Kaduna Electricity (PostPaid)",
        imageUrl: "https://buypower.ng/static/media/Kaduna.7c4019d3.svg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers: [
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_KADUNA,
                active: true
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.INTERSWITCH_KADUNA_PREPAID,
                active: false
            }
        ],
        label: "Meter Number"
    },
    {
        name: "Kaduna Electricity (Prepaid)",
        imageUrl: "https://buypower.ng/static/media/Kaduna.7c4019d3.svg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers: [
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_KADUNA,
                active: true
            }
        ],
        label: "Meter Number"
    },
    {
        name: "Jos Electricity (PostPaid)",
        imageUrl: "https://buypower.ng/static/media/Jedc.4e92534e.svg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers: [
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_JOS,
                active: true
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.INTERSWITCH_JOS_POSTPAID,
                active: false
            },
        ],
        label: "Meter Number"
    },
    {
        name: "Jos Electricity (Prepaid)",
        imageUrl: "https://buypower.ng/static/media/Jedc.4e92534e.svg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers: [
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_JOS,
                active: true
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.INTERSWITCH_JOS_PREPAID,
                active: false
            },
        ],
        label: "Meter Number"
    },
    {
        name: "Benin Electricity (Prepaid)",
        imageUrl: "https://www.vtpass.com/resources/products/200X200/Benin-Electricity-BEDC.jpg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers: [
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_BENIN,
                active: true
            },
        ],
        label: "Meter Number" 
    },
    {
        name: "Benin Electricity (PostPaid)",
        imageUrl: "https://www.vtpass.com/resources/products/200X200/Benin-Electricity-BEDC.jpg",
        category: "Electricity",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.Cowry, PaymentTypes.Wallet],
        displayCountries: ["NG"],
        type: ProductTypes.Electricity,
        providers: [
            {
                name: Providers.PrimeAirtime,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.PRIME_AIRTIME_BENIN,
                active: false
            },
            {
                name: Providers.Interswitch,
                serviceId: ServiceTypes.Electricity,
                productId: ProductIDs.INTERSWITCH_BENIN_POSTPAID,
                active: true
            },
        ],
        label: "Meter Number" 
    },
    
    {
        name: "TeleBank Cowries",
        imageUrl: "https://res.cloudinary.com/dfhteb3xs/image/upload/v1682963457/telebank/IMAGE-1_rfezja.png",
        category: "Gift Card",
        allowedPaymentOptions: [PaymentTypes.Flutterwave, PaymentTypes.BinancePay, PaymentTypes.Wallet],
        displayCountries: ["GLC"],
        type: ProductTypes.GiftCard,
        providers:[{
            name: Providers.TeleBank,
            productId: ProductIDs.TELEBANK_COWRY,
            serviceId: ServiceTypes.GiftCard,
            active: true
        }],
        currency: "COY",
        minPrice: "50",
        maxPrice: "1000",
        label: "Email Address"
    }
];   

export const currencyData = [
    {
        default: true,
        name: "US Dollars",
        code: "USD",
        symbol: "$",
        base: "USD",
        rate: 1,
        status: "active",
        isP2P: false
    },
    {
        default: true,
        name: "Naira",
        code: "NGN",
        symbol: "#",
        base: "USD",
        rate: 1500,
        status: "active",
        isP2P: true
    },
    {
        default: true,
        name: "Cowry",
        code: "COY",
        symbol: "c",
        base: "USD",
        rate: 100,
        status: "active",
        isP2P: false
    },
    {
        default: true,
        name: "Euro",
        code: "EUR",
        symbol: "€",
        base: "USD",
        rate: 1.02,
        status: "active",
        isP2P: true
    },
]

export const settingsData: ISettings[] = [
    {
        type: SettingsType.globalDiscount,
        value: 0.01,
        active: true
    },
    {
        type: SettingsType.disableRegistration,
        value: 0,
        active: false
    },
]

export const paymentMethodsData: IPaymentMethod[] = [
    {
        name: "Cowry",
        type: PaymentTypes.Cowry,
        currencySupported: ["USD"],
        isActive: true
    },
    {
        name: "Flutterwave",
        type: PaymentTypes.Flutterwave,
        currencySupported: ["NGN", "XAF", "EGP", "GHS", "ZAR", "RWF", "KES", "CLP", "COP", "MWK", "MAD", "SLL", "STD", "TZS", "UGX", "ZMW", "XOF"],
        isActive: true
    },
    {
        name: "Binance Pay",
        type: PaymentTypes.BinancePay,
        currencySupported: ["USD"],
        isActive: true
    },
    {
        name: "Wallet",
        type: PaymentTypes.Wallet,
        currencySupported: ["wallet"],
        isActive: true
    },
]


export const adminData: IAdminUser[] = [
    {
        email: "admin@telebank.com",
        password: "telebankadmin",
        firstName: "TeleBank",
        lastName: "Admin",
        isEmailVerified: true,
        phoneNumber: "+2340000000000",
        country: "NG",
        accountType: AccountType.ADMIN
    }
]