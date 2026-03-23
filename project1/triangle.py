def check_if_triangle(a, b, c):
    if a <= 0 or b <= 0 or c <= 0: 
        return "Invalid triangle"

    if ( a + b <= c or a + c <= b or b + c <= a ) :
        return "Invalid triangle"


    if ( a == b == c ) :
        return "Equilateral"
    elif ( a == b or b == c or a == c ):
        return "Isosceles"
    else:
        return "Scalene"



if __name__ == "__main__":
    a = float(input("Enter side 1: "))
    b = float(input("Enter side 2: "))
    c = float(input("Enter side 3: "))

    result = check_if_triangle(a, b, c)
    print("Result:", result)