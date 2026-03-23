import unittest
from triangle import check_if_triangle

class TestTriangle(unittest.TestCase):

    # 🔷 Basic Valid Cases
    def test_scalene(self):
        self.assertEqual(check_if_triangle(3, 4, 5), "Scalene")

    def test_equilateral(self):
        self.assertEqual(check_if_triangle(5, 5, 5), "Equilateral")

    def test_isosceles(self):
        self.assertEqual(check_if_triangle(5, 5, 3), "Isosceles")

    # 🔷 Different Order Inputs
    def test_order_variations(self):
        self.assertEqual(check_if_triangle(5, 3, 4), "Scalene")
        self.assertEqual(check_if_triangle(4, 5, 3), "Scalene")

    # 🔷 Triangle Inequality Failures
    def test_invalid_triangle_boundary(self):
        self.assertEqual(check_if_triangle(1, 2, 3), "Invalid triangle")
        self.assertEqual(check_if_triangle(2, 3, 5), "Invalid triangle")
        self.assertEqual(check_if_triangle(10, 5, 15), "Invalid triangle")

    # 🔷 Zero Values
    def test_zero_values(self):
        self.assertEqual(check_if_triangle(0, 4, 5), "Invalid triangle")
        self.assertEqual(check_if_triangle(3, 0, 5), "Invalid triangle")
        self.assertEqual(check_if_triangle(3, 4, 0), "Invalid triangle")

    # 🔷 Negative Values
    def test_negative_values(self):
        self.assertEqual(check_if_triangle(-1, 4, 5), "Invalid triangle")
        self.assertEqual(check_if_triangle(3, -4, 5), "Invalid triangle")
        self.assertEqual(check_if_triangle(3, 4, -5), "Invalid triangle")

    # 🔷 Large Numbers
    def test_large_values(self):
        self.assertEqual(check_if_triangle(1000, 1000, 1000), "Equilateral")
        self.assertEqual(check_if_triangle(1000, 999, 998), "Scalene")

    # 🔷 Decimal Values
    def test_decimal_values(self):
        self.assertEqual(check_if_triangle(2.5, 3.5, 4.5), "Scalene")
        self.assertEqual(check_if_triangle(5.5, 5.5, 5.5), "Equilateral")

    # 🔷 Edge Cases (Almost Invalid)
    def test_edge_cases(self):
        self.assertEqual(check_if_triangle(1, 1, 1.9999), "Isosceles")
        self.assertEqual(check_if_triangle(1, 1, 2), "Invalid triangle")


if __name__ == "__main__":
    unittest.main()