from cProfile import label


def query_constraint_title_normalize(text, withbrackets=False):
    PARSE_FUNCTIONS = [
        str.lower,
        str.strip
    ]
    NULL_COND = [
        lambda s: s == 'NULL',
        lambda s: not s,
        lambda s: not any(map(str.isalpha, s)),
        lambda s: len(s) > 30
    ]
    for i in NULL_COND:
        if i(text): return 'NULL'
    for i in PARSE_FUNCTIONS:
        text = i(text)
    if withbrackets: return f'\'{text}\''
    return f'{text}'
def query_constraint_from_none_to_null(constr):
    if not constr:
        return 'NULL'
    return constr
def query_contraint_if_not_null_to_list(constr):
    if type(constr) != list and constr != 'NULL':
        return [str(i) for i in constr.split(',')]
    return constr
def query_constraint_numeric_normalize(constr):
    if not constr:
        return 'NULL'
    return int(constr)

def genresNormalize(constr):
    constr = query_contraint_if_not_null_to_list(query_constraint_from_none_to_null(constr))
    if constr != 'NULL':
        for i in range(len(constr)):
            constr[i] = query_constraint_title_normalize(constr[i])
        while True:
            try:
                constr.remove('NULL')
            except ValueError:
                break
    return constr