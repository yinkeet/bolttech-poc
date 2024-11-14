INSERT INTO customer (first_name, last_name, date_of_birth, address, phone_number, email)
VALUES 
    ('John', 'Doe', '1985-03-15', '123 Maple Street', '123-456-7890', 'john.doe@example.com'),
    ('Jane', 'Smith', '1990-07-20', '456 Oak Avenue', '234-567-8901', 'jane.smith@example.com'),
    ('Alice', 'Johnson', '1978-12-11', '789 Pine Lane', '345-678-9012', 'alice.johnson@example.com');

INSERT INTO device (customer_id, type, brand, model, serial_number, purchase_date, value)
VALUES 
    (1, 'smartphone', 'Apple', 'iPhone 13', 'SN12345A', '2024-01-10', 999.99),
    (1, 'tablet', 'Samsung', 'Galaxy Tab S7', 'SN23456B', '2022-11-20', 750.00),
    (2, 'smartphone', 'Google', 'Pixel 7', 'SN34567C', '2024-04-15', 899.00),
    (3, 'smartphone', 'Apple', 'iPhone 15', 'SN45678D', '2021-12-01', 799.99);

INSERT INTO policy (customer_id, device_id, policy_number, premium, start_date, end_date, status)
VALUES 
    (1, 1, 'P12345', 400.00, '2024-01-15', '2025-01-15', 'active'),
    (1, 2, 'P23456', 120.00, '2022-11-25', '2023-11-25', 'expired'),
    (2, 3, 'P34567', 110.00, '2024-05-01', '2025-05-01', 'active'),
    (3, 4, 'P45678', 115.00, '2024-12-10', '2025-12-10', 'active');

INSERT INTO coverage (name, description, coverage_limit)
VALUES 
    ('Screen Protection', 'Covers screen damage and replacement costs', 300.00),
    ('Water Damage', 'Covers repair or replacement due to water damage', 500.00),
    ('Theft Protection', 'Covers replacement in case of theft', 700.00),
    ('Battery Replacement', 'Covers battery replacement costs', 100.00);

INSERT INTO policy_coverage (policy_id, coverage_id, coverage_limit_override, start_date, end_date)
VALUES
    -- policy 1
    (1, 1, 350.00, '2024-01-15', '2025-01-15'),
    (1, 2, 500.00, '2024-01-15', '2025-01-15'),
    (1, 3, 600.00, '2024-01-15', '2025-01-15'),
    (1, 4, 150.00, '2024-01-15', '2025-01-15'),
    -- policy 2
    (2, 1, 500.00, '2022-11-25', '2023-11-25'),
    (2, 4, 300.00, '2022-11-25', '2023-11-25'),
    -- policy 3
    (3, 1, 300.00, '2024-05-01', '2025-05-01'),
    -- policy 4
    (4, 1, 300.00, '2024-12-10', '2025-12-10');

INSERT INTO claim (policy_id, coverage_id, claim_number, claim_date, amount_claimed, amount_approved, status)
VALUES 
    -- policy 1
    (1, 1, 'C12345', '2024-02-15', 350.00, 350.00, 'approved'),
    (1, 2, 'C23456', '2024-02-15', 500.00, 0, 'rejected'),
    -- policy 3
    (3, 1, 'C34567', '2024-11-01', 300.00, 0, 'pending');

INSERT INTO claim_document (claim_id, type, path, original_filename)
VALUES 
    (1, 'image/png', '/claims/1/bfef0e07-29b4-486a-951d-30ea528eb239.png', 'bfef0e07-29b4-486a-951d-30ea528eb239.png'),
    (2, 'application/pdf', '/claims/2/159b9fcd-1421-4b79-a24e-49260ee090e4.pdf', '159b9fcd-1421-4b79-a24e-49260ee090e4.pdf'),
    (3, 'image/jpg', '/claims/3/2fb5dbe0-f611-430f-9b35-085d5d14e563.jpeg', '2fb5dbe0-f611-430f-9b35-085d5d14e563.jpeg');
