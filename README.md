# Crypto Chat Project Documentation

## 1. Project Overview
**Project Name:** *Crypto Chat*  

**Description:**  
This app was developed as the final project for a Cryptography Course. It consists of a RESTful Java Spring API backend and a classic frontend built with HTML, CSS, JavaScript, and Tailwind CSS. The application implements JWT for authentication and authorization to ensure security. The project simulates a comprehensive key distribution system, showcasing practical applications of cryptographic principles in a secure messaging environment. We adopted a simple horizontal architecture in the back-end and focused on maintaining clean code despite the limited development timeframe.

![Crypto Chat Overview](assets/1.png)

## 2. Authentication System with JWT

### How JWT is Implemented

JSON Web Tokens (JWT) serve as the backbone of our authentication system. JWT is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.

### Integration with Spring Security

We've integrated JWT authentication using Spring Security by implementing the following components:

1. **JWT Filter**: Intercepts incoming requests to validate tokens
2. **Authentication Provider**: Verifies credentials during login
3. **Token Generator**: Creates signed tokens upon successful authentication
4. **Security Configuration**: Configures protected endpoints and authentication requirements

### Authentication Flow

1. **User Registration/Login**:
   - User submits credentials (username/password)
   - Backend validates credentials
   - Upon successful validation, a JWT token is generated and returned

2. **Token Management**:
   - Frontend stores the token in localStorage
   - For subsequent requests, the token is included in the Authorization header
   - Backend validates the token for each protected endpoint request

3. **Access Control**:
   - Public endpoints (signup, login) are accessible without tokens
   - Protected endpoints (/users, /sessions, etc.) require valid tokens
   - Invalid or expired tokens result in 401/403 responses

![JWT Authentication Architecture](assets/2.png)

### Code Implementation (Example)

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeRequests()
            .antMatchers("/api/auth/login", "/api/auth/signup").permitAll()
            .antMatchers("/api/users/**", "/api/sessions/**").authenticated()
            .and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
    }
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
            .passwordEncoder(passwordEncoder());
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

## 3. Cryptographic System Architecture

### Key Generation Process

Our system implements a comprehensive key management approach:

1. **Registration Phase**:
   - System generates a public/private RSA key pair for each user
   - Private key is stored in the user's localStorage (client-side)
   - Public key is sent to and stored in the backend database

2. **Session Establishment**:
   - When a user requests a chat session, the system generates:
     - Two RSA keys (one for sender, one for receiver)
     - A random Caesar cipher key for symmetric encryption
   - These keys are securely distributed using the users' public keys

![Key Distribution System](assets/3.png)

### Encryption Implementation

The system employs a hybrid encryption approach:

```java
public String encryptWithRSAPublicKey(String plainText, String base64PublicKey) {
    try {
        PublicKey publicKey = convertToPublicKey(base64PublicKey);
        Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
        OAEPParameterSpec oaepParams = new OAEPParameterSpec(
                "SHA-256", "MGF1", MGF1ParameterSpec.SHA256, PSource.PSpecified.DEFAULT);
        cipher.init(Cipher.ENCRYPT_MODE, publicKey, oaepParams);
        byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    } catch (Exception e) {
        throw new RuntimeException("Failed to encrypt with RSA OAEP", e);
    }
}

private PublicKey convertToPublicKey(String base64PublicKey) throws Exception {
    byte[] keyBytes = Base64.getDecoder().decode(base64PublicKey);
    X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
    KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
    return keyFactory.generatePublic(keySpec);
}
```

### Messaging Flow

1. **Session Initialization**:
   - User A requests a session with User B
   - Backend generates a Caesar cipher key
   - This key is encrypted with both users' public RSA keys
   - Encrypted keys are sent to respective users

2. **Secure Communication**:
   - Users decrypt the RSA-encrypted data to extract the Caesar key
   - All messages are encrypted/decrypted using this shared Caesar key
   - The communication remains secure as long as the session is active

![Secure Messaging Process](assets/4.png)

## 4. System Architecture

### Backend (Java Spring)

- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic and cryptographic operations
- **Repositories**: Interface with the database
- **Security**: JWT authentication and authorization
- **Models**: Entity definitions and data structures

### Frontend

- **HTML/CSS/JavaScript**: User interface and interaction
- **Tailwind CSS**: Styling and responsive design
- **LocalStorage**: Secure client-side storage for keys and tokens
- **AJAX/Fetch API**: Communication with backend endpoints

### Database

- User credentials (hashed)
- Public keys
- Session metadata (without exposing sensitive cryptographic material)

![System Architecture Diagram](assets/5.png)

## 5. Improvements and Future Work

### Architectural Enhancements

- **Onion Architecture**: Implementing a more layered approach in the backend to better separate features and concerns
- **Microservices**: Separating client request handling from the key distribution system
- **Enhanced Frontend**: Improving visual design and user experience

### Security Enhancements

- **Additional Encryption Layers**: Implementing more sophisticated encryption algorithms
- **Perfect Forward Secrecy**: Ensuring that session keys cannot compromise past communications
- **Key Rotation**: Implementing automatic key rotation policies

### User Experience Improvements

- **Transparent Encryption**: Following the WhatsApp model where encryption happens seamlessly in the background
- **Push Notifications**: Adding real-time messaging capabilities
- **Multi-device Support**: Allowing secure access from multiple devices

## 6. Screenshots and Demos

### User Registration
![User Registration](assets/6.png)

### Dashboard
![Dashboard](assets/8.png)

### Session Creation
![Session Creation](assets/9.png)

### Chat Interface
![Chat Interface](assets/10.png)

## 7. Conclusion

The Crypto Chat project demonstrates practical application of cryptographic principles in a real-world messaging system. By implementing JWT for authentication and a hybrid RSA/Caesar encryption system for secure communications, we've created a functional prototype that showcases the importance of key distribution and secure messaging protocols. While there are numerous opportunities for enhancement, the current implementation provides a solid foundation for understanding cryptographic systems in practice.

---

*This project was developed by Karam Imamali, Kamran Guliyev, Davud Gurbanov, Ramazan Huseynli as part of the Cryptography Course final project, 2025.*
