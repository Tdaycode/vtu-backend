"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyData = exports.productsData = exports.categoriesData = exports.kycLevelsData = void 0;
const product_interface_1 = require("./../interfaces/product.interface");
const kyc_interface_1 = require("../interfaces/kyc.interface");
const payment_interface_1 = require("../interfaces/payment.interface");
exports.kycLevelsData = [
    {
        level: kyc_interface_1.KYCLevels.Level_1,
        dailyLimit: "100",
        monthlyLimit: "1000",
        baseCurrency: "USD"
    },
    {
        level: kyc_interface_1.KYCLevels.Level_2,
        dailyLimit: "5000",
        monthlyLimit: "50000",
        baseCurrency: "USD"
    },
    {
        level: kyc_interface_1.KYCLevels.Level_3,
        dailyLimit: "10000",
        monthlyLimit: "unlimited",
        baseCurrency: "USD",
    },
];
exports.categoriesData = [
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
exports.productsData = [
    {
        name: "MTN",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiIwMDcxZDFlOC1mMDYyLTQwYzktYTU5Yy00MjE2OTMxOGI0ZTYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Airtime",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Airtime,
        label: "Phone Number",
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                active: true
            }]
    },
    {
        name: "GLO",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI3NGYwMTEwYS1iZWZmLTQxOWMtODY4Mi1lZDk5ZjZkZGIxZjIucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Airtime",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Airtime,
        label: "Phone Number",
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                active: true
            }]
    },
    {
        name: "Airtel",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI0ODQ1YTEzMS02NzE4LTRlZGItYjViMi0xZDIzMzcxNzhmZTkucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Airtime",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Airtime,
        label: "Phone Number",
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                active: true
            }]
    },
    {
        name: "9mobile",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI4OTExMDk4MC1iZjY4LTRlMjYtYTk3ZS00NGFkNzEzYzUwZGQucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Airtime",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Airtime,
        label: "Phone Number",
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                active: true
            }]
    },
    {
        name: "MTN",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiIwMDcxZDFlOC1mMDYyLTQwYzktYTU5Yy00MjE2OTMxOGI0ZTYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Data",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Data,
        label: "Phone Number",
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                active: true
            }]
    },
    {
        name: "GLO",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI3NGYwMTEwYS1iZWZmLTQxOWMtODY4Mi1lZDk5ZjZkZGIxZjIucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Data",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Data,
        label: "Phone Number",
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                active: true
            }]
    },
    {
        name: "Airtel",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI0ODQ1YTEzMS02NzE4LTRlZGItYjViMi0xZDIzMzcxNzhmZTkucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Data",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Data,
        label: "Phone Number",
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                active: true
            }]
    },
    {
        name: "9mobile",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI4OTExMDk4MC1iZjY4LTRlMjYtYTk3ZS00NGFkNzEzYzUwZGQucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Data",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Data,
        label: "Phone Number",
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                active: true
            }]
    },
    {
        name: "DStv",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "TV",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.TV,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.TV,
                productId: "BPD-NGCA-AQA",
                active: true
            }],
        label: "Smart Card Number"
    },
    {
        name: "GOtv",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJmODE3MWEwYi0wNDQxLTRiMWItOWVlNS03NzkwMWUzMjA3ZjYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "TV",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.TV,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.TV,
                productId: "BPD-NGCA-AQC",
                active: true
            }],
        label: "IUC Number"
    },
    {
        name: "StarTimes",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI5YzVkODM5YS0xYjE4LTQ0MzItOTEzMS00ZTEzZmMyZmZjN2YucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "TV",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.TV,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                productId: "BPD-NGCA-AWA",
                serviceId: product_interface_1.ServiceTypes.TV,
                active: true
            }],
        label: "Smart Card Number"
    },
    {
        name: "BET9JA",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Betting",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Betting,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Lottery,
                productId: "BET9JA",
                active: true
            }],
        label: "Customer ID"
    },
    {
        name: "BANGBET",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Betting",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Betting,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Lottery,
                productId: "BANGBET",
                active: true
            }],
        label: "Customer ID"
    },
    {
        name: "NAIRABET",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Betting",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Betting,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Lottery,
                productId: "NAIRABET",
                active: true
            }],
        label: "Customer ID"
    },
    {
        name: "SUPABET",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Betting",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Betting,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Lottery,
                productId: "SUPABET",
                active: true
            }],
        label: "Customer ID"
    },
    {
        name: "1XBET",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Betting",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Betting,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Lottery,
                productId: "1XBET",
                active: true
            }],
        label: "Customer ID"
    },
    {
        name: "MERRYBET",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Betting",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Betting,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Lottery,
                productId: "MERRYBET",
                active: true
            }],
        label: "Customer ID"
    },
    {
        name: "BETLION",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Betting",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Betting,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Lottery,
                productId: "BETLION",
                active: true
            }],
        label: "Customer ID"
    },
    {
        name: "BETWAY",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Betting",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Betting,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Lottery,
                productId: "BETWAY",
                active: true
            }],
        label: "Customer ID"
    },
    {
        name: "LIVESCOREBET",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Betting",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Betting,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Lottery,
                productId: "LIVESCOREBET",
                active: true,
            }],
        label: "Customer ID"
    },
    {
        name: "CLOUDBET",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Betting",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Betting,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Lottery,
                productId: "CLOUDBET",
                active: true
            }],
        label: "Customer ID"
    },
    {
        name: "NAIJABET",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Betting",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Betting,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Lottery,
                productId: "NAIJABET",
                active: true
            }],
        label: "Customer ID"
    },
    {
        name: "BETKING",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Betting",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Betting,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Lottery,
                productId: "BETKING",
                active: true
            }],
        label: "Customer ID"
    },
    {
        name: "BETLAND",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJjYmMwNTlkZi1hNjljLTQyOGEtYmVkNi1mNGM2ZmExMjYwYzYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Betting",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Betting,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Lottery,
                productId: "BETLAND",
                active: true
            }],
        label: "Customer ID"
    },
    {
        name: "SpectraNet",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI5ZTE4MGQzNS05MzYzLTRjZTEtOWZjNi02OTAwOTBhOTM2M2EucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Internet",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Internet,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Internet,
                productId: "BPI-NGCA-BGA",
                active: true
            }],
        label: "Customer ID"
    },
    {
        name: "Smile",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiI0NjFiZTg1YS1mZDA3LTQ0ZDctOTllNS0xNGU3MzRmNjBhNTYucG5nLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Internet",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Internet,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Internet,
                productId: "BPI-NGCA-ANB",
                active: true
            }],
        label: "Customer ID"
    },
    {
        name: "Eko Electricity",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiIzZTkzZTY3ZC01MzQ5LTRjMmItYWExNC0yYzU1YWZjZGFhZWMuanBnLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Electricity",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Electricity,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Electricity,
                productId: "BPE-NGEK-OR",
                active: true
            }],
        label: "Meter Number"
    },
    {
        name: "Ikeja Electricity",
        imageUrl: "https://d13ms5efar3wc5.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMtY2Fycnkxc3QtcHJvZHVjdHMiLCJrZXkiOiJlZTliYzIwYS1jMzJhLTRkZDgtYTA1NS1jMmFmMjRiNTY2OGUuanBnLndlYnAiLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjQyMCwiaGVpZ2h0Ijo0MjAsImZpdCI6ImZpbGwiLCJvcHRpb25zIjp7ImJhY2tncm91bmQiOnsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYWxwaGEiOjAuNX19fX19",
        category: "Electricity",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Electricity,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Electricity,
                productId: "BPE-NGIE-OR",
                active: true
            }],
        label: "Meter Number"
    },
    {
        name: "IBEDC(Ibadan)",
        imageUrl: "https://buypower.ng/static/media/Ibedc.885256cf.svg",
        category: "Electricity",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Electricity,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Electricity,
                productId: "BPE-NGIB-OR",
                active: true
            }],
        label: "Meter Number"
    },
    {
        name: "EEDC(Enugu)",
        imageUrl: "https://buypower.ng/static/media/Eedc.83c6f334.svg",
        category: "Electricity",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Electricity,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Electricity,
                productId: "BPE-NGEN-OR",
                active: true
            }],
        label: "Meter Number"
    },
    {
        name: "Port Harcourt Prepaid",
        imageUrl: "https://buypower.ng/static/media/Phedc.1983fe10.svg",
        category: "Electricity",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Electricity,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Electricity,
                productId: "BPE-NGCABIA-OR",
                active: true
            }],
        label: "Meter Number"
    },
    {
        name: "Port Harcourt Postpaid",
        imageUrl: "https://buypower.ng/static/media/Phedc.1983fe10.svg",
        category: "Electricity",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Electricity,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Electricity,
                productId: "BPE-NGCABIB-OR",
                active: true
            }],
        label: "Meter Number"
    },
    {
        name: "Kano Prepaid",
        imageUrl: "https://buypower.ng/static/media/Kedco.d8a236b7.svg",
        category: "Electricity",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Electricity,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Electricity,
                productId: "BPE-NGCAAVB-OR",
                active: true
            }],
        label: "Meter Number"
    },
    {
        name: "Kano Postpaid",
        imageUrl: "https://buypower.ng/static/media/Kedco.d8a236b7.svg",
        category: "Electricity",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Electricity,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Electricity,
                productId: "BPE-NGCAAVC-OR",
                active: true
            }],
        label: "Meter Number"
    },
    {
        name: "Abuja Prepaid",
        imageUrl: "https://buypower.ng/static/media/Aedc.de20ada0.svg",
        category: "Electricity",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Electricity,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Electricity,
                productId: "BPE-NGCABABA-OR",
                active: true
            }],
        label: "Meter Number"
    },
    {
        name: "Abuja Postpaid",
        imageUrl: "https://buypower.ng/static/media/Aedc.de20ada0.svg",
        category: "Electricity",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Electricity,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Electricity,
                productId: "BPE-NGCABABB-OR",
                active: true
            }],
        label: "Meter Number"
    },
    {
        name: "Kaduna Electricity",
        imageUrl: "https://buypower.ng/static/media/Kaduna.7c4019d3.svg",
        category: "Electricity",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Electricity,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Electricity,
                productId: "BPE-NGKD-OR",
                active: true
            }],
        label: "Meter Number"
    },
    {
        name: "Jos Electricity",
        imageUrl: "https://buypower.ng/static/media/Jedc.4e92534e.svg",
        category: "Electricity",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Electricity,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Electricity,
                productId: "BPE-NGJO-OR",
                active: true
            }],
        label: "Meter Number"
    },
    {
        name: "Benin Electricity",
        imageUrl: "https://www.vtpass.com/resources/products/200X200/Benin-Electricity-BEDC.jpg",
        category: "Electricity",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave],
        displayCountries: ["NG"],
        type: product_interface_1.ProductTypes.Electricity,
        providers: [{
                name: product_interface_1.Providers.PrimeAirtime,
                serviceId: product_interface_1.ServiceTypes.Electricity,
                productId: "BPE-NGCABENIN-OR",
                active: true
            }],
        label: "Meter Number"
    },
    {
        name: "GiftCop Cowries",
        imageUrl: "https://res.cloudinary.com/dfhteb3xs/image/upload/v1682963457/giftcop/IMAGE-1_rfezja.png",
        category: "Gift Card",
        allowedPaymentOptions: [payment_interface_1.PaymentTypes.Flutterwave, payment_interface_1.PaymentTypes.Adyen, payment_interface_1.PaymentTypes.BinancePay],
        displayCountries: ["GLC"],
        type: product_interface_1.ProductTypes.GiftCard,
        providers: [{
                name: product_interface_1.Providers.GiftCop,
                productId: "cowry",
                serviceId: product_interface_1.ServiceTypes.GiftCard,
                active: true
            }],
        currency: "COY",
        minPrice: "50",
        maxPrice: "1000",
        label: "Email Address"
    }
];
exports.currencyData = [
    {
        default: true,
        name: "US Dollars",
        code: "USD",
        symbol: "$",
        base: "USD",
        rate: 1,
        status: "active"
    },
    {
        default: true,
        name: "Naira",
        code: "NGN",
        symbol: "$",
        base: "USD",
        rate: 750,
        status: "active"
    },
    {
        default: true,
        name: "Cowry",
        code: "COY",
        symbol: "c",
        base: "USD",
        rate: 100,
        status: "active"
    },
];
