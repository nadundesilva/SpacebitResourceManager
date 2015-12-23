<?php

namespace Spacebit\ResourcesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class VenuesController extends Controller
{
    public function venuesAction()
    {
        //$request = Request::createFromGlobals();
        //$category = $request->query->get('category');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM venue');
        //$stmt->bindValue(':category', $category);
        $stmt->execute();
        $result = $stmt->fetchAll();

        return $this->render('SpacebitResourcesBundle:Default:venues.html.twig', array(
            'venue_categories'=>$result,
        ));
    }
}
