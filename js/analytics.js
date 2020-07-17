// gtag recommended events: https://developers.google.com/gtagjs/reference/event

const EVENT_LABEL_HOME = 'home';
const EVENT_LABEL_TAGS = 'tags'
const EVENT_LABEL_HOME_PAGINATION = 'home_pagination';
const EVENT_LABEL_RELATED_ARTICLES = 'related_articles';
const EVENT_LABEL_TRENDING_ARTICLES = 'trending_articles';
const EVENT_LABEL_RECOMMEND_BOOKS = 'recommend_books';
const EVENT_LABEL_LATEST_ARTICLES = 'latest_articles';
const EVENT_LABEL_ARTICLES_BY_TAG = 'articles_by_tag';
const EVENT_LABEL_ARTICLES_BY_TAG_MORE = 'articles_by_tag_more';

function trackViewArticle(event_label, items) {
  gtag('event', 'view_item', { event_label, items });
}

function trackViewArticleList(event_label) {
  gtag('event', 'view_item_list', { event_label });
}

function trackLead(item) {
  gtag('event', 'generate_lead', { event_label: item })
}

function trackShare({ method, content_type, content_id }) {
  gtag('event', 'share', {method, content_type, content_id});
}