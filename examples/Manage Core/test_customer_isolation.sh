#!/bin/bash

# Customer Data Isolation Test Script
# This script verifies the implementation of separate AR and Super Admin customer tables

echo "==============================================="
echo "Customer Data Isolation Verification Tests"
echo "==============================================="
echo ""

BASE_URL="http://localhost/api/v1"
AUTH_TOKEN="${AUTH_TOKEN:-}"  # Set via environment variable

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test Counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Helper function to run tests
run_test() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local expected_status="$4"
    local data="$5"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Test $TOTAL_TESTS: $test_name ... "
    
    if [ "$method" == "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $AUTH_TOKEN" \
            -H "Content-Type: application/json")
    elif [ "$method" == "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $AUTH_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}PASS${NC} (HTTP $http_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}FAIL${NC} (Expected: $expected_status, Got: $http_code)"
        echo "  Response: $body"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo -e "${YELLOW}Prerequisite: Set AUTH_TOKEN environment variable with a valid JWT token${NC}"
echo ""

# ==========================================
# Test 1: AR Customers Endpoints
# ==========================================
echo -e "${YELLOW}=== AR Customers Tests ===${NC}"

run_test "List AR Customers" "GET" "/customers" "200"
run_test "Get AR Customer Stats" "GET" "/customers/stats" "200"

# ==========================================
# Test 2: Super Admin Customers Endpoints
# ==========================================
echo -e "${YELLOW}=== Super Admin Customers Tests ===${NC}"

run_test "List Super Admin Customers (requires super_admin role)" "GET" "/super-admin/customers" "200 or 403"
run_test "Get Super Admin Customer Stats" "GET" "/super-admin/customers/stats" "200 or 403"

# ==========================================
# Test 3: Data Isolation Tests
# ==========================================
echo -e "${YELLOW}=== Data Isolation Tests ===${NC}"

echo ""
echo "Test: Verify AR customers endpoint returns ONLY clients table data"
echo "Expected: Response should NOT include any superadmin_customers data"
echo "Command:"
echo "  curl -X GET http://localhost/api/v1/customers \\"
echo "    -H 'Authorization: Bearer YOUR_TOKEN' | jq '.data[0]'"
echo ""

echo "Test: Verify Super Admin customers endpoint returns ONLY superadmin_customers table data"
echo "Expected: Response should NOT include any clients data"
echo "Command:"
echo "  curl -X GET http://localhost/api/v1/super-admin/customers \\"
echo "    -H 'Authorization: Bearer YOUR_TOKEN' | jq '.data[0]'"
echo ""

# ==========================================
# Test 4: Database Verification
# ==========================================
echo -e "${YELLOW}=== Database Verification ===${NC}"

echo ""
echo "Manual verification steps:"
echo ""
echo "1. Verify superadmin_customers table exists:"
echo "   sqlite3 database.sqlite '.schema superadmin_customers'"
echo ""
echo "2. Verify superadmin_customer_contacts table exists:"
echo "   sqlite3 database.sqlite '.schema superadmin_customer_contacts'"
echo ""
echo "3. Count records in each table:"
echo "   sqlite3 database.sqlite 'SELECT COUNT(*) FROM clients;'"
echo "   sqlite3 database.sqlite 'SELECT COUNT(*) FROM superadmin_customers;'"
echo ""

# ==========================================
# Summary
# ==========================================
echo ""
echo "==============================================="
echo "Test Summary"
echo "==============================================="
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please review the errors above.${NC}"
    exit 1
fi
