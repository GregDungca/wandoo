//
//  WandooModel.swift
//  ParseStarterProject-Swift
//
//  Created by Brian Kwon on 12/15/15.
//  Copyright © 2015 Parse. All rights reserved.
//

import Foundation
import FBSDKCoreKit

class WandooModel {
    
    var userID: String?
    var text: String?
    var startTime: NSDate?
    var endTime: NSDate?
    var postTime: NSDate?
    var latitude: Double?
    var longitude: Double?
    var numPeople: Int?
    
    static let sharedWandooInstance = WandooModel()
    
    func getUserIDWithFacebookID(facebookID: String, completion: (userID: Int) -> Void) {
        
        let url = NSURL(string: "http://localhost:8000/api/users/" + facebookID)
        
        let task = NSURLSession.sharedSession().dataTaskWithURL(url!) {(data, response, error) in
            
            if let data = data {
                do {
                    let parsedData = try NSJSONSerialization.JSONObjectWithData(data, options: .MutableContainers) as? NSDictionary
                    var userID: Int = (parsedData!["userID"] as? Int)!
                    completion(userID: userID)
                } catch {
                    print("Something went wrong")
                }
            }
        }
    }
    
    func postWandoo(completion: (result: NSDictionary) -> Void) {
        
        var postInfo: [String: AnyObject] = [
            "userID": 1,
            "text": "test",
            "startTime": "2015-12-12T01:30:00.040Z",
            "endTime": "2015-12-12T01:30:00.040Z",
            "postTime": "2015-12-12T01:30:00.040Z",
            "latitude": 1.23,
            "longitude": 1.23,
            "numPeople": 3
        ]
        
        let url = NSURL(string: "http://localhost:8000/api/wandoos")
        
        let request = NSMutableURLRequest(URL: url!)
        
        let session = NSURLSession.sharedSession()
        request.HTTPMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        request.HTTPBody = try! NSJSONSerialization.dataWithJSONObject(postInfo, options: [])
        
        let task = session.dataTaskWithRequest(request) { data, response, error in
            print("success")
        }
        task.resume()
    }
    
    func getWandoo(completion: (result: NSDictionary) -> Void) {
        let url = NSURL(string: "http://localhost:8000/api/wandoos")
        
        let task = NSURLSession.sharedSession().dataTaskWithURL(url!) {(data, response, error) in
            
            if let data = data {
                do {
                    let parsedData = try NSJSONSerialization.JSONObjectWithData(data, options: .MutableContainers) as? NSDictionary
                    completion(result: parsedData!)
                } catch {
                    print("Something went wrong")
                }
            }
        }
        
        task.resume()
        
    }
    
    func getWandoos(offset: Int, limit: Int, completion: (result: NSArray) -> Void) {
        let url = NSURL(string: "http://localhost:8000/api/wandoos/?offset=" + String(offset) + "&limit=" + String(limit))
        
        let task = NSURLSession.sharedSession().dataTaskWithURL(url!) {(data, response, error) in
            
            if let data = data {
                do {
                    let parsedData = try NSJSONSerialization.JSONObjectWithData(data, options: .MutableContainers) as? NSDictionary
                    let unwrappedData = parsedData!["data"] as! NSArray
                    completion(result: unwrappedData)
                } catch {
                    print("Something went wrong")
                }
            }
        }
        
        task.resume()
    }
    
    func getAllWandoos(completion: (result: NSArray) -> Void) {
        let url = NSURL(string: "http://localhost:8000/api/wandoos/")
        
        let task = NSURLSession.sharedSession().dataTaskWithURL(url!) {(data, response, error) in
            
            if let data = data {
                do {
                    let parsedData = try NSJSONSerialization.JSONObjectWithData(data, options: .MutableContainers) as? NSDictionary
                    let unwrappedData = parsedData!["data"] as! NSArray
                    completion(result: unwrappedData)
                } catch {
                    print("Something went wrong")
                }
            }
        }
        
        task.resume()
    }
}
