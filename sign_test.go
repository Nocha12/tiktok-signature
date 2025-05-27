package main

import "testing"

func TestXttparams(t *testing.T) {
	query := "a=1&b=2&is_encryption=1"
	password := "webapp1.0+202106"
	expected := "LuLPuavyxVA88healnz5DIEaksZ0F9gBVwIRPuA49euBYdw9bQ2u54DCDA4xnXi5"

	res, err := xttparams(query, password)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if res != expected {
		t.Errorf("expected %s, got %s", expected, res)
	}
}
