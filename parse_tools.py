from cProfile import label

#NULL для sql

def query_constraint_title_normalize(text, withbrackets=False): #нормализует "название" фильма (чего угодно)
    """
    принимает на вход текст, проверяет по условиям, если не подходит, возвращает 'NULL'. если подходит возвращает текст в кавычках/без
    """
    PARSE_FUNCTIONS = [
        str.lower,
        str.strip
    ]
    NULL_COND = [
        lambda s: s == 'NULL', #если текст NULL то возвращает NULL
        lambda s: not s, #если передана FALSE\None
        lambda s: not any(map(str.isalpha, s)), #если в тексте нет букв
        lambda s: len(s) > 30 #если длина текста больше 30
    ]
    for i in NULL_COND:
        if i(text): return 'NULL'
    for i in PARSE_FUNCTIONS:
        text = i(text)
    if withbrackets: return f'\'{text}\''
    return f'{text}'
def query_constraint_from_none_to_null(constr): 
    """
    преобразует значение None python'a в текстовое 'NULL' для sql
    """
    if not constr:
        return 'NULL'
    return constr
def query_contraint_if_not_null_to_list(constr):
    """
    если передано не NULLевое значение, то, если оно уже не является массивом значений (одно значение/значения через запятую), преобразует в массив
    """
    if type(constr) != list and constr != 'NULL':
        return [str(i) for i in constr.split(',')]
    return constr
def query_constraint_numeric_normalize(constr):
    """
    нормализует числовые значения: преобразует из строкового значения в int, если передано None/False то возвращает NULL
    """
    if not constr:
        return 'NULL'
    return int(constr)

def genresNormalize(constr):
    """
    нормализует переданный список жанров. Принимает на вход строку жанров через запятую/массив строк жанров/none, NULL значения
    """
    constr = query_contraint_if_not_null_to_list(query_constraint_from_none_to_null(constr)) #преобразуем возможную строку в массив
    if constr != 'NULL':
        for i in range(len(constr)): #нормализуем каждую строку в массиве
            constr[i] = query_constraint_title_normalize(constr[i])
        while True: #удаляем все 'NULL' значения из массива
            try:
                constr.remove('NULL')
            except ValueError:
                break
    return constr