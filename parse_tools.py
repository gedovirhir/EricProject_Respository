def query_constraint_title_normalize(text):
    PARSE_FUNCTIONS = [
        str.lower,
        str.strip
    ]
    if text == 'NULL':
        return text
    if not text:
        return 'NULL' 
    for i in PARSE_FUNCTIONS:
        text = i(text)
    return f'\'{text}\''
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