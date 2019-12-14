# GTM

## GTM + GA的關聯是？

GTM可以設定GA Tag (Universal Analytics)

[Deploy Google Analytics with Tag Manager
](https://support.google.com/tagmanager/answer/6107124?hl=en&ref_topic=6333310)

用GTM就可以貼GA貼碼

## Data Layer

```html
<script>
  dataLayer = [{
    'pageCategory': 'signup',
    'visitorType': 'high-value'
  }];
</script>
<!-- Google Tag Manager -->
...
<!-- End Google Tag Manager -->
```

```html
<a href="#" name="button1" onclick="dataLayer.push({'event': 'button1-click'});" >Button 1</a>
```

## Enhanced Ecommerce

[About Enhanced Ecommerce](https://support.google.com/analytics/answer/6014841)

[如何用tag manager實作Enhanced Ecommerce (using the Data Layer)](https://developers.google.com/tag-manager/enhanced-ecommerce)

可以用data layer或是custom javascript variable實作

在gtm中create a Universal Analytics tag, 等於是貼一段ga貼碼

[Google Analytics ecommerce:
Use Tag Manager to implement Google Analytics ecommerce tags.](https://support.google.com/tagmanager/answer/6107169)

[Set up Ecommerce Tracking](https://support.google.com/analytics/answer/1009612)



## Universal Analytics

