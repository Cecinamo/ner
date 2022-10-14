from collections import Counter
from datetime import datetime

import spacy

from sklearn.metrics import classification_report, confusion_matrix

from model.named_entity import NamedEntity


def evaluate(ner_model, examples, spacy_model, pretty=True):
    def _add_entities(doc, entities):
        res = doc.copy()
        spans = []
        for ent in entities:
            span = res.char_span(ent['start_index'], ent['end_index'], label=ent['tag'])
            if span:
                spans.append(span)
        res.set_ents(entities=spans)#default="unmodified")
        return res

    nlp = spacy.load(spacy_model)
    y_true = []
    y_pred = []

    for row in examples:
        input_ = row['text']
        annot = [NamedEntity(start,end,tag).__dict__ for start,end,tag in row['entities']]
        pred = [ne.__dict__ for ne in ner_model(text=input_)]
        doc = nlp(input_)

        annotations = _add_entities(doc, annot)
        predictions = _add_entities(doc, pred)
        # print('REFERENCE:')
        # print([(el.text, el.i, el.pos_, el.ent_type_, el.ent_iob_) for el in annotations])
        y_true += [el.ent_type_ or 'O' for el in annotations]
        # print('PREDICTED')
        # print([(el.text, el.i, el.pos_, el.ent_type_, el.ent_iob_) for el in pred])
        y_pred += [el.ent_type_ or 'O' for el in predictions]
    cr = classification_report(y_true,y_pred, output_dict=True)
    cm = confusion_matrix(y_true,y_pred).tolist()
    distro = dict(hist=Counter(y_true))
    dt = datetime.strptime(ner_model.date_of_creation, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S.%f')
    if not pretty:
        return dict(tdist=distro, report_test=dict(classification_report=cr, confusion_matrix=cm),
                    datetime=dt, task='classification')
    if pretty:
        labels = sorted(distro['hist'].keys())
        cr = pretty_classification_report(cr)
        metrics = cr['metrics']
        cr = pretty_cr(cr['classification_report'])
        cm = pretty_confusion_matrix(cm, labels=labels)

        return dict(tdist=distro, cv_scores=None, datetime=date_converter(dt), task='classification',
                    test_report=dict(classification_report=cr, confusion_matrix=cm, metrics=metrics),
                    report_split=None)

def perc_converter(n):
    if not isinstance(n, (int, float)):
        return n
    else:
        return round(n*100)

def pretty_cr(cr):
    exc = ['label', 'support']
    return [dict((k+' (%)',perc_converter(v)) if k not in exc else (k,v) for k,v in row.items()) for row in cr]

def pretty_classification_report(cr, **kwargs):
    if not cr:
        return {'classification_report': None, 'metrics': None}
    metrics = {}
    clf_rep = []
    for k,v in cr.items():
        if isinstance(v, float):
            metrics.update({k:v})
        else:
            row = dict(label = k)
            row.update(v)
            clf_rep.append(row)
    return {'classification_report': clf_rep, 'metrics': metrics}

def pretty_confusion_matrix(cm, labels, **kwargs):
    return dict(values=cm, labels=labels)

def date_converter(dt, format='%Y-%m-%d %H:%M:%S.%f'):
    dt = datetime.strptime(dt, format)
    dt = dt.timestamp() * 1000
    return dt


if __name__ == '__main__':
    from pprint import pprint

    from dao.ner_dao import NERDao
    from config.app_config import LANG_CODE_MAP

    data = [
              {"text": "Uber blew through $1 million a week", "entities": [[0, 4, "ORG"]]},
              {"text": "Android Pay expands to Canada", "entities": [[0, 11, "PRODUCT"], [23, 30, "GPE"]]},
              {"text": "Spotify steps up Asia expansion", "entities": [[0, 8, "ORG"], [17, 21, "LOC"]]}
        ]

    ner_dao = NERDao(dir_path='../../resources/')
    extractor = ner_dao.load_model('ce')
    spacy_model = LANG_CODE_MAP[extractor.lang]
    # print(data)
    results = evaluate(extractor, data, spacy_model)
    pprint(results)