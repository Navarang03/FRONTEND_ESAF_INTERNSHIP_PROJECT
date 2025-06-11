import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
  userId: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/login'; // Change to your API base URL
  private refreshUrl = 'http://localhost:5000/api/token/refresh';

  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  public isLoggedIn = new BehaviorSubject<boolean>(this.hasValidAccessToken());

  constructor(private http: HttpClient) {
    // Try refresh token on startup if access token expired or missing
    this.tryRefreshTokenIfNeeded();
  }

  login(emailOrPhone: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, { emailOrPhone, password }).pipe(
      tap(res => {
        this.setTokens(res.token, res.refreshToken);
        this.isLoggedIn.next(true);
        this.scheduleRefreshToken();
        localStorage.setItem('name',res.name)
      }),
      catchError(err => {
        this.isLoggedIn.next(false);
        return throwError(err);
      })
    );
  }

  logout() {
    this.clearTokens();
    this.isLoggedIn.next(false);

  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  private clearTokens() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem('name')
  }

  private hasValidAccessToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    // Check token expiry by decoding JWT exp (simplified)
    const expiry = this.getTokenExpiration(token);
    if (!expiry) return false;

    return expiry > Date.now() / 1000;
  }

  private getTokenExpiration(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp || null;
    } catch {
      return null;
    }
  }

  private scheduleRefreshToken() {
    const token = this.getAccessToken();
    const expiry = this.getTokenExpiration(token!);
    if (!expiry) return;

    const expiresInMs = (expiry * 1000) - Date.now() - 60000; // Refresh 1 min before expiry

    timer(expiresInMs).subscribe(() => {
      this.refreshToken().subscribe();
    });
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError('No refresh token available');
    }

    return this.http.post<LoginResponse>(this.refreshUrl, { refreshToken }).pipe(
      tap(res => {
        this.setTokens(res.token, res.refreshToken);
        this.isLoggedIn.next(true);
        this.scheduleRefreshToken();
      }),
      catchError(err => {
        this.logout();
        return throwError(err);
      })
    );
  }

  private tryRefreshTokenIfNeeded() {
    if (!this.hasValidAccessToken() && this.getRefreshToken()) {
      this.refreshToken().subscribe({
        error: () => this.logout()
      });
    }
  }

  isAuthenticated(): boolean {
  const token = this.getAccessToken();
  // Add your own token validation logic
  return !!token;
}

}
