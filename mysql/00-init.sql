CREATE TABLE IF NOT EXISTS customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    address VARCHAR(255),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS policy (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    policy_number VARCHAR(50) NOT NULL UNIQUE,
    premium DECIMAL(10, 2),
    start_date DATE NOT NULL,
    end_date DATE,
    status ENUM('active', 'expired', 'canceled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);

CREATE TABLE IF NOT EXISTS coverage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    coverage_limit DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS policy_coverage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    policy_id INT,
    coverage_id INT,
    coverage_limit_override DECIMAL(10, 2),
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES policy(id),
    FOREIGN KEY (coverage_id) REFERENCES coverage(id)
);

CREATE TABLE IF NOT EXISTS claim (
    id INT AUTO_INCREMENT PRIMARY KEY,
    policy_id INT,
    coverage_id INT,
    claim_number VARCHAR(50) NOT NULL UNIQUE,
    claim_date DATE NOT NULL,
    amount_claimed DECIMAL(10, 2),
    amount_approved DECIMAL(10, 2),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES policy(id),
    FOREIGN KEY (coverage_id) REFERENCES coverage(id)
);

CREATE TABLE IF NOT EXISTS payment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    policy_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('credit_card', 'bank_transfer', 'cash'),
    status ENUM('completed', 'pending', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES policy(id)
);

CREATE TABLE IF NOT EXISTS claim_document (
	id INT AUTO_INCREMENT PRIMARY KEY,
    claim_id INT,
    type VARCHAR(50),
    document_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (claim_id) REFERENCES claim(id)
);