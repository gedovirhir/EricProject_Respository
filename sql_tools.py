import sqlite3

def get_conn_cursor(path = "bd/main_bd.sqlite") -> tuple:
    conn = sqlite3.connect(path,timeout=10)
    return (conn, conn.cursor())
def query_exec(query, path = "bd/main_bd.sqlite"):
    conn, c = get_conn_cursor(path)
    c.execute("PRAGMA foreign_keys = ON;")
    c.execute(query)
    res = c.fetchall()
    conn.commit()
    conn.close()
    return res
def regular_LIKE_str_query(strings: list, column: str): #ДЛЯ ФИЛЬТРА genres, ДЛЯ LIKE, ищет все строки, в которых строки из strings являются подстроками, т.е. column LIKE '%string1%' AND column LIKE '%string2%' ...
    if strings != 'NULL':
        return f'{column} LIKE \'%' + f'%\' AND {column} LIKE \'%'.join(strings) + '%\''
    return 'TRUE'
def regular_IN_str_query(strings: list, column: str): #ДЛЯ ФИЛЬТРА year
    if strings != 'NULL':
        for i in range(len(strings)):
            strings[i] = str(strings[i])
        st = "\',\'".join(strings)
        return f'{column} IN (\'{st}\')'
    return 'TRUE'