const EVENT_LABEL_HOME = 'home';
const EVENT_LABEL_TAGS = 'tags'
const EVENT_LABEL_HOME_PAGINATION = 'home_pagination';
const EVENT_LABEL_RELATED_ARTICLES = 'related_articles';
const EVENT_LABEL_LATEST_ARTICLES = 'latest_articles';
const EVENT_LABEL_ARTICLES_BY_TAG = 'articles_by_tag';

function trackViewArticle(event_label) {
  gtag('event', 'view_item', { event_label });
}

function trackViewArticleList(event_label) {
  gtag('event', 'view_item_list', { event_label });
}

function trackLead(item) {
  gtag('event', 'generate_lead', { event_label: item })
}